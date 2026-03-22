export default function MenuCard({ item, onAdd }) {
  const hasImage = item.imageUrl && item.imageUrl.trim() !== "";

  return (
    <div className="menu-card">
      <div className="menu-card-img">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"4px 4px 0 0" }}
          />
        ) : (
          <div style={{ fontSize:52, display:"flex", alignItems:"center", justifyContent:"center", height:"100%", background:"#F5EFE4" }}>
            {item.img || "🍽️"}
          </div>
        )}
      </div>
      <div className="menu-card-body">
        <div className="menu-card-name">{item.name}</div>
        <div className="menu-card-desc">{item.desc}</div>
        <div className="menu-card-footer">
          <div className="menu-card-price">${item.price}</div>
          {item.tag && <span className="menu-card-tag">{item.tag}</span>}
          {onAdd && (
            <button className="menu-card-btn" onClick={() => onAdd(item)}>
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}