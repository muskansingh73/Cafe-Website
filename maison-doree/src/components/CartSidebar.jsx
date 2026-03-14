import { useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQty, clearCart, setPage } = useApp();
  const [checkout, setCheckout] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", type:"delivery", payment:"cod" });
  const [errors, setErrors] = useState({});

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const subtotal = total;
  const delivery = form.type === "delivery" ? 40 : 0;
  const grand    = subtotal + delivery;

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    if (!form.phone.trim())   e.phone   = "Phone is required";
    if (form.type === "delivery" && !form.address.trim()) e.address = "Address is required for delivery";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrder() {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.createOrder({
        customer: { name: form.name, email: form.email, phone: form.phone, address: form.address },
        items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty, img: i.img, menuItem: i._id || i.id })),
        total: grand,
        type: form.type,
        paymentMethod: form.payment,
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function closeAll() {
    setCartOpen(false);
    setCheckout(false);
    setSuccess(false);
    setForm({ name:"", email:"", phone:"", address:"", type:"delivery", payment:"cod" });
  }

  if (!cartOpen) return null;

  const S = {
    overlay: { position:"fixed", inset:0, background:"rgba(28,28,26,0.5)", zIndex:200 },
    drawer: { position:"fixed", top:0, right:0, bottom:0, width:420, background:"#FAF7F2", zIndex:201, display:"flex", flexDirection:"column", boxShadow:"-8px 0 40px rgba(28,28,26,0.15)", fontFamily:"'Jost',sans-serif" },
    header: { padding:"28px 28px 20px", borderBottom:"1px solid #DDD5C8", display:"flex", justifyContent:"space-between", alignItems:"center" },
    title: { fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:300, color:"#3D2B1F" },
    closeBtn: { background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#8A7E74", padding:4 },
    body: { flex:1, overflowY:"auto", padding:"20px 28px" },
    item: { display:"flex", alignItems:"center", gap:16, padding:"16px 0", borderBottom:"1px solid #DDD5C8" },
    itemImg: { width:56, height:56, background:"#F5EFE4", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 },
    itemName: { fontSize:14, fontWeight:500, color:"#1C1C1A" },
    itemPrice: { fontSize:13, color:"#8A7E74", marginTop:2 },
    qtyRow: { display:"flex", alignItems:"center", gap:10, marginTop:6 },
    qtyBtn: { width:28, height:28, background:"#F5EFE4", border:"1px solid #DDD5C8", borderRadius:2, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" },
    qtyNum: { fontSize:14, fontWeight:500, color:"#1C1C1A", minWidth:20, textAlign:"center" },
    footer: { padding:"20px 28px 28px", borderTop:"1px solid #DDD5C8" },
    totalRow: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
    totalLabel: { fontSize:13, color:"#8A7E74" },
    totalVal: { fontSize:13, color:"#1C1C1A", fontWeight:500 },
    grandLabel: { fontSize:15, fontWeight:600, color:"#3D2B1F" },
    grandVal: { fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:"#3D2B1F" },
    checkoutBtn: { width:"100%", padding:"15px", background:"#3D2B1F", color:"#F5EFE4", border:"none", borderRadius:2, fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", marginTop:16, fontFamily:"'Jost',sans-serif" },
    empty: { textAlign:"center", padding:"60px 0", color:"#8A7E74" },
    emptyIcon: { fontSize:48, marginBottom:12 },

    // Checkout form styles
    formTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#3D2B1F", marginBottom:20 },
    formGroup: { marginBottom:16 },
    label: { display:"block", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3D2B1F", marginBottom:6 },
    input: { width:"100%", border:"1px solid #DDD5C8", borderRadius:2, padding:"10px 12px", fontSize:13, fontFamily:"'Jost',sans-serif", color:"#1C1C1A", background:"#FFFFFF", outline:"none", boxSizing:"border-box" },
    inputErr: { width:"100%", border:"1px solid #9B4A2A", borderRadius:2, padding:"10px 12px", fontSize:13, fontFamily:"'Jost',sans-serif", color:"#1C1C1A", background:"#FFFFFF", outline:"none", boxSizing:"border-box" },
    errMsg: { fontSize:11, color:"#9B4A2A", marginTop:4 },
    radioRow: { display:"flex", gap:12, marginTop:6 },
    radioBtn: (active) => ({ flex:1, padding:"10px", border: active ? "2px solid #3D2B1F" : "1px solid #DDD5C8", borderRadius:4, background: active ? "#F5EFE4" : "#FFFFFF", cursor:"pointer", fontSize:13, fontWeight: active ? 500 : 400, color:"#1C1C1A", textAlign:"center", fontFamily:"'Jost',sans-serif" }),
    summaryBox: { background:"#F5EFE4", borderRadius:4, padding:16, marginBottom:20 },
    summaryItem: { display:"flex", justifyContent:"space-between", fontSize:13, color:"#8A7E74", marginBottom:6 },
    backBtn: { background:"none", border:"none", fontSize:13, color:"#8A7E74", cursor:"pointer", marginBottom:16, fontFamily:"'Jost',sans-serif", padding:0 },
    placeBtn: (loading) => ({ width:"100%", padding:15, background: loading ? "#8A7E74" : "#3D2B1F", color:"#F5EFE4", border:"none", borderRadius:2, fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily:"'Jost',sans-serif" }),

    // Success styles
    successWrap: { textAlign:"center", padding:"40px 20px" },
    successIcon: { fontSize:56, marginBottom:16 },
    successTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:300, color:"#3D2B1F", marginBottom:8 },
    successSub: { fontSize:14, color:"#8A7E74", lineHeight:1.7, marginBottom:28 },
    doneBtn: { background:"#3D2B1F", color:"#F5EFE4", border:"none", padding:"14px 32px", borderRadius:2, fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Jost',sans-serif" },
  };

  return (
    <>
      <div style={S.overlay} onClick={closeAll} />
      <div style={S.drawer}>

        {/* ── Success Screen ── */}
        {success && (
          <>
            <div style={S.header}>
              <div style={S.title}>Order Placed!</div>
              <button style={S.closeBtn} onClick={closeAll}>✕</button>
            </div>
            <div style={{...S.body, display:"flex", alignItems:"center", justifyContent:"center"}}>
              <div style={S.successWrap}>
                <div style={S.successIcon}>🎉</div>
                <div style={S.successTitle}>Thank you for your order!</div>
                <div style={S.successSub}>
                  A confirmation has been sent to<br/>
                  <strong>{form.email}</strong><br/><br/>
                  Estimated {form.type === "delivery" ? "delivery" : "pickup"}: <strong>35–45 minutes</strong>
                </div>
                <button style={S.doneBtn} onClick={closeAll}>Back to Menu</button>
              </div>
            </div>
          </>
        )}

        {/* ── Checkout Form ── */}
        {!success && checkout && (
          <>
            <div style={S.header}>
              <div style={S.title}>Checkout</div>
              <button style={S.closeBtn} onClick={closeAll}>✕</button>
            </div>
            <div style={S.body}>
              <button style={S.backBtn} onClick={() => setCheckout(false)}>← Back to cart</button>
              <div style={S.formTitle}>Your Details</div>

              <div style={S.formGroup}>
                <label style={S.label}>Full Name</label>
                <input style={errors.name ? S.inputErr : S.input} name="name" value={form.name} onChange={handle} placeholder="Your full name" />
                {errors.name && <div style={S.errMsg}>{errors.name}</div>}
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Email</label>
                <input style={errors.email ? S.inputErr : S.input} name="email" value={form.email} onChange={handle} placeholder="your@email.com" />
                {errors.email && <div style={S.errMsg}>{errors.email}</div>}
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Phone</label>
                <input style={errors.phone ? S.inputErr : S.input} name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
                {errors.phone && <div style={S.errMsg}>{errors.phone}</div>}
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Order Type</label>
                <div style={S.radioRow}>
                  <button style={S.radioBtn(form.type==="delivery")} onClick={() => setForm(f => ({...f, type:"delivery"}))}>🛵 Delivery</button>
                  <button style={S.radioBtn(form.type==="pickup")}   onClick={() => setForm(f => ({...f, type:"pickup"}))}>🏃 Pickup</button>
                </div>
              </div>

              {form.type === "delivery" && (
                <div style={S.formGroup}>
                  <label style={S.label}>Delivery Address</label>
                  <textarea style={{...(errors.address ? S.inputErr : S.input), resize:"vertical", minHeight:72}} name="address" value={form.address} onChange={handle} placeholder="Enter your full delivery address" />
                  {errors.address && <div style={S.errMsg}>{errors.address}</div>}
                </div>
              )}

              <div style={S.formGroup}>
                <label style={S.label}>Payment</label>
                <div style={S.radioRow}>
                  <button style={S.radioBtn(form.payment==="cod")}    onClick={() => setForm(f => ({...f, payment:"cod"}))}>💵 Cash on Delivery</button>
                  <button style={S.radioBtn(form.payment==="online")} onClick={() => setForm(f => ({...f, payment:"online"}))}>💳 Pay Online</button>
                </div>
              </div>

              <div style={S.summaryBox}>
                <div style={S.summaryItem}><span>Subtotal</span><span>₹{subtotal}</span></div>
                {form.type === "delivery" && <div style={S.summaryItem}><span>Delivery</span><span>₹{delivery}</span></div>}
                <div style={{...S.summaryItem, fontWeight:600, color:"#3D2B1F", fontSize:15, marginBottom:0}}>
                  <span>Total</span><span>₹{grand}</span>
                </div>
              </div>
            </div>

            <div style={{padding:"0 28px 28px"}}>
              <button style={S.placeBtn(loading)} onClick={placeOrder} disabled={loading}>
                {loading ? "Placing Order…" : `Place Order · ₹${grand}`}
              </button>
            </div>
          </>
        )}

        {/* ── Cart ── */}
        {!success && !checkout && (
          <>
            <div style={S.header}>
              <div style={S.title}>Your Cart</div>
              <button style={S.closeBtn} onClick={closeAll}>✕</button>
            </div>

            <div style={S.body}>
              {cart.length === 0 ? (
                <div style={S.empty}>
                  <div style={S.emptyIcon}>🛒</div>
                  <div>Your cart is empty</div>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={item._id||item.id||i} style={S.item}>
                    <div style={S.itemImg}>{item.img}</div>
                    <div style={{flex:1}}>
                      <div style={S.itemName}>{item.name}</div>
                      <div style={S.itemPrice}>₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
                      <div style={S.qtyRow}>
                        <button style={S.qtyBtn} onClick={() => updateQty(item._id||item.id, -1)}>−</button>
                        <span style={S.qtyNum}>{item.qty}</span>
                        <button style={S.qtyBtn} onClick={() => updateQty(item._id||item.id, +1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={S.footer}>
                <div style={S.totalRow}>
                  <span style={S.totalLabel}>Delivery</span>
                  <span style={S.totalVal}>₹40</span>
                </div>
                <div style={{...S.totalRow, marginTop:8}}>
                  <span style={S.grandLabel}>Total</span>
                  <span style={S.grandVal}>₹{total}</span>
                </div>
                <button style={S.checkoutBtn} onClick={() => setCheckout(true)}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}