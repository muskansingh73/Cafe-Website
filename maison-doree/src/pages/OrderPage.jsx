import { useState } from "react";
import { useApp } from "../context/AppContext";
import MenuCard from "../components/MenuCard";

export default function OrderPage() {
  const { menu, cart, addToCart, updateQty, clearCart } = useApp();
  const [tab, setTab] = useState("breakfast");
  const [done, setDone] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (done) return (
    <section
      className="section"
      style={{ paddingTop: 120, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="success-box">
        <div className="success-icon">🛵</div>
        <h2 className="success-title">Order Placed!</h2>
        <p className="success-text">
          Your order is confirmed and our kitchen is already working on it.
          Estimated delivery: 35–45 minutes. You'll receive an SMS update shortly.
        </p>
        <button className="btn-primary" onClick={() => { clearCart(); setDone(false); }}>
          Order Again
        </button>
      </div>
    </section>
  );

  const tabs = [
    { id: "breakfast", label: "☀️ Breakfast" },
    { id: "lunch",     label: "🌤️ Lunch" },
    { id: "dinner",    label: "🌙 Dinner" },
  ];

  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Online Order</div>
        <h2 className="section-title">Order <em>Delivery</em> or Pickup</h2>
      </div>

      <div className="order-layout">
        {/* ── Menu ── */}
        <div>
          <div className="menu-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`menu-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="menu-grid">
            {(menu[tab] || []).map(item => (
              <MenuCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="order-summary-card">
          <div className="order-summary-title">Your Order</div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🍽️</div>
              <div className="empty-text">Add items from the menu to start your order</div>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-emoji">{item.img}</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price} each</div>
                  </div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: "center" }}>
                      {item.qty}
                    </span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <div className="cart-total">
                  <span>Subtotal</span>
                  <span className="cart-total-val">${total}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
                  Delivery fee & taxes calculated at checkout
                </div>
                <button className="form-submit" onClick={() => setDone(true)}>
                  Place Order · ${total}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
