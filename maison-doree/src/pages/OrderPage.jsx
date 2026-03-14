import { useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import MenuCard from "../components/MenuCard";

export default function OrderPage() {
  const { menu, cart, addToCart, updateQty, clearCart } = useApp();
  const [tab,     setTab]     = useState("breakfast");
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({ name:"", email:"", phone:"", address:"", type:"delivery", payment:"cod" });
  const [errors,  setErrors]  = useState({});
  const [step,    setStep]    = useState("cart"); // "cart" | "checkout"

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = form.type === "delivery" ? 40 : 0;
  const grand    = total + delivery;

  const tabs = [
    { id:"breakfast", label:"☀️ Breakfast" },
    { id:"lunch",     label:"🌤️ Lunch" },
    { id:"dinner",    label:"🌙 Dinner" },
  ];

  function handle(e) {
    setForm(f => ({...f, [e.target.name]: e.target.value}));
    setErrors(er => ({...er, [e.target.name]: ""}));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.type === "delivery" && !form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrder() {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.createOrder({
        customer: { name:form.name, email:form.email, phone:form.phone, address:form.address },
        items: cart.map(i => ({ name:i.name, price:i.price, qty:i.qty, img:i.img, menuItem:i._id||i.id })),
        total: grand,
        type: form.type,
        paymentMethod: form.payment,
      });
      clearCart();
      setDone(true);
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ──
  if (done) return (
    <section className="section" style={{paddingTop:120, minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div className="success-box">
        <div className="success-icon">🛵</div>
        <h2 className="success-title">Order Placed!</h2>
        <p className="success-text">
          Your order is confirmed! Confirmation sent to <strong>{form.email}</strong>.<br/>
          Estimated {form.type === "delivery" ? "delivery" : "pickup"}: <strong>35–45 minutes</strong>.
        </p>
        <button className="btn-primary" onClick={() => { setDone(false); setStep("cart"); setForm({name:"",email:"",phone:"",address:"",type:"delivery",payment:"cod"}); }}>
          Order Again
        </button>
      </div>
    </section>
  );

  const inputStyle = { width:"100%", border:"1px solid #DDD5C8", borderRadius:2, padding:"10px 12px", fontSize:13, fontFamily:"'Jost',sans-serif", color:"#1C1C1A", background:"#FFFFFF", outline:"none", boxSizing:"border-box", marginBottom:4 };
  const inputErrStyle = {...inputStyle, border:"1px solid #9B4A2A"};
  const labelStyle = { display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3D2B1F", marginBottom:6 };
  const errStyle = { fontSize:11, color:"#9B4A2A", marginBottom:12 };
  const radioBtn = (active) => ({ flex:1, padding:"10px", border: active ? "2px solid #3D2B1F" : "1px solid #DDD5C8", borderRadius:4, background: active ? "#F5EFE4" : "#FFFFFF", cursor:"pointer", fontSize:13, fontWeight: active ? 500 : 400, color:"#1C1C1A", textAlign:"center", fontFamily:"'Jost',sans-serif" });

  return (
    <section className="section" style={{paddingTop:120}}>
      <div className="section-header">
        <div className="section-eyebrow">Online Order</div>
        <h2 className="section-title">Order <em>Delivery</em> or Pickup</h2>
      </div>

      <div className="order-layout">
        {/* ── Menu ── */}
        <div>
          <div className="menu-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`menu-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="menu-grid">
            {(menu[tab]||[]).map((item,i) => (
              <MenuCard key={item._id||item.id||i} item={item} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* ── Order Summary / Checkout ── */}
        <div className="order-summary-card">

          {/* Cart view */}
          {step === "cart" && <>
            <div className="order-summary-title">Your Order</div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🍽️</div>
                <div className="empty-text">Add items from the menu to start your order</div>
              </div>
            ) : (
              <>
                {cart.map((item,i) => (
                  <div key={item._id||item.id||i} className="cart-item">
                    <div className="cart-item-emoji">{item.img}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">₹{item.price} each</div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => updateQty(item._id||item.id, -1)}>−</button>
                      <span style={{fontSize:14, fontWeight:500, minWidth:20, textAlign:"center"}}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id||item.id, +1)}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:24, paddingTop:20, borderTop:"1px solid var(--border)"}}>
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <span className="cart-total-val">₹{total}</span>
                  </div>
                  <div style={{fontSize:12, color:"var(--muted)", marginBottom:16}}>
                    Delivery fee calculated at checkout
                  </div>
                  <button className="form-submit" onClick={() => setStep("checkout")}>
                    Proceed to Checkout · ₹{total}
                  </button>
                </div>
              </>
            )}
          </>}

          {/* Checkout form */}
          {step === "checkout" && <>
            <button onClick={() => setStep("cart")} style={{background:"none", border:"none", fontSize:13, color:"#8A7E74", cursor:"pointer", marginBottom:16, fontFamily:"'Jost',sans-serif", padding:0}}>
              ← Back to cart
            </button>
            <div className="order-summary-title" style={{fontSize:20}}>Your Details</div>

            <div style={{marginTop:16}}>
              <label style={labelStyle}>Full Name</label>
              <input style={errors.name ? inputErrStyle : inputStyle} name="name" value={form.name} onChange={handle} placeholder="Your full name" />
              {errors.name && <div style={errStyle}>{errors.name}</div>}

              <label style={labelStyle}>Email</label>
              <input style={errors.email ? inputErrStyle : inputStyle} name="email" value={form.email} onChange={handle} placeholder="your@email.com" />
              {errors.email && <div style={errStyle}>{errors.email}</div>}

              <label style={labelStyle}>Phone</label>
              <input style={errors.phone ? inputErrStyle : inputStyle} name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
              {errors.phone && <div style={errStyle}>{errors.phone}</div>}

              <label style={labelStyle}>Order Type</label>
              <div style={{display:"flex", gap:8, marginBottom:16}}>
                <button style={radioBtn(form.type==="delivery")} onClick={() => setForm(f => ({...f, type:"delivery"}))}>🛵 Delivery</button>
                <button style={radioBtn(form.type==="pickup")}   onClick={() => setForm(f => ({...f, type:"pickup"}))}>🏃 Pickup</button>
              </div>

              {form.type === "delivery" && <>
                <label style={labelStyle}>Delivery Address</label>
                <textarea style={{...(errors.address ? inputErrStyle : inputStyle), resize:"vertical", minHeight:72}} name="address" value={form.address} onChange={handle} placeholder="Enter your full delivery address" />
                {errors.address && <div style={errStyle}>{errors.address}</div>}
              </>}

              <label style={labelStyle}>Payment</label>
              <div style={{display:"flex", gap:8, marginBottom:20}}>
                <button style={radioBtn(form.payment==="cod")}    onClick={() => setForm(f => ({...f, payment:"cod"}))}>💵 Cash on Delivery</button>
                <button style={radioBtn(form.payment==="online")} onClick={() => setForm(f => ({...f, payment:"online"}))}>💳 Pay Online</button>
              </div>

              <div style={{background:"#F5EFE4", borderRadius:4, padding:16, marginBottom:16}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:13, color:"#8A7E74", marginBottom:6}}>
                  <span>Subtotal</span><span>₹{total}</span>
                </div>
                {form.type === "delivery" && (
                  <div style={{display:"flex", justifyContent:"space-between", fontSize:13, color:"#8A7E74", marginBottom:6}}>
                    <span>Delivery</span><span>₹{delivery}</span>
                  </div>
                )}
                <div style={{display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:600, color:"#3D2B1F"}}>
                  <span>Total</span><span>₹{grand}</span>
                </div>
              </div>

              <button
                className="form-submit"
                onClick={placeOrder}
                disabled={loading}
                style={{opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer"}}
              >
                {loading ? "Placing Order…" : `Place Order · ₹${grand}`}
              </button>
            </div>
          </>}

        </div>
      </div>
    </section>
  );
}