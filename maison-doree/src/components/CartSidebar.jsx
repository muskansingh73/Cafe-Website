import { useApp } from "../context/AppContext";

export default function CartSidebar() {
  const { cart, updateQty, setCartOpen } = useApp();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-sidebar">
        <div className="cart-head">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <div className="empty-text">Your cart is empty</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-emoji">{item.img}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    ${item.price} × {item.qty} = ${item.price * item.qty}
                  </div>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: "center" }}>
                    {item.qty}
                  </span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-val">${total}</span>
            </div>
            <button className="form-submit" onClick={() => setCartOpen(false)}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
