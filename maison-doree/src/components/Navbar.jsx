import { useState } from "react";
import { useApp } from "../context/AppContext";

const links = [
  { id: "home",        label: "Home" },
  { id: "menu",        label: "Menu" },
  { id: "order",       label: "Order Online" },
  { id: "reservation", label: "Reserve" },
];

export default function Navbar() {
  const { page, setPage, cartCount, setCartOpen } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  function go(p) {
    setPage(p);
    setMenuOpen(false);
  }

  return (
    <>
      <nav>
        <div className="nav-logo" onClick={() => go("home")}>
          Maison <span>Dorée</span>
        </div>

        {/* ── Desktop links ── */}
        <div className="nav-links">
          {links.map(l => (
            <button
              key={l.id}
              className={`nav-link ${page === l.id ? "active" : ""}`}
              onClick={() => go(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn-primary" style={{ padding: "10px 24px", fontSize: "12px" }} onClick={() => go("reservation")}>
            Book a Table
          </button>
        </div>

        {/* ── Mobile right ── */}
        <div className="nav-mobile-right">
          <button className="cart-btn" onClick={() => setCartOpen(true)} style={{ marginRight: 8 }}>
            🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span className={menuOpen ? "ham-line open1" : "ham-line"} />
            <span className={menuOpen ? "ham-line open2" : "ham-line"} />
            <span className={menuOpen ? "ham-line open3" : "ham-line"} />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="mobile-drawer" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer-inner" onClick={e => e.stopPropagation()}>
            {links.map(l => (
              <button
                key={l.id}
                className={`mobile-nav-link ${page === l.id ? "mobile-active" : ""}`}
                onClick={() => go(l.id)}
              >
                {l.label}
              </button>
            ))}
            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: 12, padding: "14px" }}
              onClick={() => go("reservation")}
            >
              Book a Table
            </button>
          </div>
        </div>
      )}
    </>
  );
}
