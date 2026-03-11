import { tagClass } from "../data";

export default function MenuCard({ item, onAdd, showAddBtn = true }) {
  return (
    <div className="menu-card">
      <div className="menu-emoji">{item.img}</div>
      <div className="menu-info">
        <div className="menu-name">{item.name}</div>
        <div className="menu-desc">{item.desc}</div>
        <div className="menu-footer">
          <div className="menu-price">${item.price}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {item.tag && (
              <span className={`menu-tag ${tagClass(item.tag)}`}>{item.tag}</span>
            )}
            {showAddBtn && onAdd && (
              <button className="add-btn" onClick={() => onAdd(item)}>
                + Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
