import { useState } from "react";
import { useApp } from "../context/AppContext";
import MenuCard from "../components/MenuCard";

export default function MenuPage() {
  const { menu, addToCart } = useApp();
  const [tab, setTab] = useState("breakfast");

  const tabs = [
    { id: "breakfast", label: "☀️ Breakfast" },
    { id: "lunch",     label: "🌤️ Lunch" },
    { id: "dinner",    label: "🌙 Dinner" },
  ];

  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div className="section-header">
        <div className="section-eyebrow">Our Menu</div>
        <h2 className="section-title">A Journey Through <em>Flavour</em></h2>
        <p className="section-sub">
          Menus change seasonally to celebrate the finest local produce.
        </p>
      </div>

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
    </section>
  );
}
