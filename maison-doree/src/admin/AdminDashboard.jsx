import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Toast from "../components/Toast";
import { api } from "../services/api";

const S = {
  layout: { display:"flex", minHeight:"100vh", fontFamily:"'Jost',sans-serif" },
  sidebar: { width:260, minWidth:260, background:"#3D2B1F", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:50, overflowY:"auto" },
  sidebarTop: { padding:"28px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" },
  userCard: { display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.06)", borderRadius:6, padding:"12px 14px" },
  avatar: { width:36, height:36, background:"rgba(201,168,76,0.25)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 },
  userName: { fontSize:13, fontWeight:500, color:"#F5EFE4", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  userRole: { fontSize:10, color:"#E8D5A3", opacity:0.7, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:2 },
  navLabel: { fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E8D5A3", padding:"20px 28px 12px", opacity:0.6 },
  signoutBtn: { width:"100%", padding:11, background:"rgba(155,74,42,0.2)", border:"1px solid rgba(155,74,42,0.4)", color:"rgba(245,239,228,0.7)", borderRadius:3, fontSize:12, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Jost',sans-serif" },
  content: { marginLeft:260, flex:1, background:"#FAF7F2", minHeight:"100vh", paddingTop:72 },
  topbar: { position:"fixed", top:0, left:260, right:0, height:72, zIndex:40, background:"rgba(250,247,242,0.97)", borderBottom:"1px solid #DDD5C8", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px" },
  topbarTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:"#3D2B1F" },
  userPill: { display:"flex", alignItems:"center", gap:12, background:"#F5EFE4", border:"1px solid #DDD5C8", borderRadius:24, padding:"8px 18px 8px 10px" },
  pillAvatar: { width:32, height:32, background:"#3D2B1F", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 },
  pillName: { fontSize:13, fontWeight:500, color:"#1C1C1A", lineHeight:1.2 },
  pillRole: { fontSize:10, color:"#8A7E74", letterSpacing:"0.05em", textTransform:"uppercase" },
  logoutBtn: { background:"none", border:"1.5px solid #DDD5C8", color:"#8A7E74", padding:"8px 16px", borderRadius:2, fontSize:12, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Jost',sans-serif" },
  page: { padding:"40px 48px 48px" },
  pageTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:"#3D2B1F", marginBottom:6 },
  pageSubtitle: { fontSize:14, color:"#8A7E74", fontWeight:300, marginBottom:36 },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, marginBottom:36 },
  statCard: { background:"#FFFFFF", border:"1px solid #DDD5C8", borderRadius:6, padding:28 },
  statVal: { fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:300, color:"#3D2B1F", lineHeight:1 },
  statLabel: { fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:"#8A7E74", marginTop:8 },
  statUp: { fontSize:12, color:"#7A8C6E", marginTop:4 },
  statDown: { fontSize:12, color:"#9B4A2A", marginTop:4 },
  tableWrap: { background:"#FFFFFF", border:"1px solid #DDD5C8", borderRadius:6, overflow:"hidden", marginBottom:32 },
  tableHead: { padding:"20px 28px", borderBottom:"1px solid #DDD5C8", display:"flex", alignItems:"center", justifyContent:"space-between" },
  tableTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#3D2B1F" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"12px 20px", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8A7E74", textAlign:"left", borderBottom:"1px solid #DDD5C8", background:"#FAF7F2", whiteSpace:"nowrap" },
  td: { padding:"16px 20px", fontSize:13, color:"#1C1C1A", borderBottom:"1px solid #DDD5C8", verticalAlign:"middle" },
  tdLast: { padding:"16px 20px", fontSize:13, color:"#1C1C1A", borderBottom:"1px solid #DDD5C8", verticalAlign:"middle" },
  approveBtn: { display:"inline-block", padding:"6px 14px", background:"#7A8C6E", color:"white", border:"none", borderRadius:2, fontSize:11, fontWeight:500, textTransform:"uppercase", cursor:"pointer", marginRight:6, fontFamily:"'Jost',sans-serif" },
  declineBtn: { display:"inline-block", padding:"6px 14px", background:"transparent", color:"#9B4A2A", border:"1px solid #9B4A2A", borderRadius:2, fontSize:11, fontWeight:500, textTransform:"uppercase", cursor:"pointer", fontFamily:"'Jost',sans-serif" },
  addBtn: { background:"#3D2B1F", color:"#F5EFE4", border:"none", padding:"12px 24px", borderRadius:2, fontSize:12, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Jost',sans-serif" },
  catTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:300, color:"#3D2B1F", marginBottom:12, textTransform:"capitalize" },
  overlay: { position:"fixed", inset:0, background:"rgba(28,28,26,0.6)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 },
  modal: { background:"#FFFFFF", borderRadius:6, padding:40, width:"100%", maxWidth:520, boxShadow:"0 12px 48px rgba(28,28,26,0.2)", maxHeight:"90vh", overflowY:"auto" },
  modalTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:"#3D2B1F", marginBottom:28 },
  formGroup: { display:"flex", flexDirection:"column", gap:6, marginBottom:18 },
  formLabel: { fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#3D2B1F" },
  formInput: { border:"1px solid #DDD5C8", borderRadius:2, padding:"11px 14px", fontSize:14, fontFamily:"'Jost',sans-serif", color:"#1C1C1A", background:"#FAF7F2", outline:"none" },
  modalActions: { display:"flex", gap:12, marginTop:24 },
  cancelBtn: { flex:1, padding:14, background:"transparent", border:"1.5px solid #DDD5C8", borderRadius:2, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'Jost',sans-serif" },
  saveBtn: { flex:2, padding:14, background:"#3D2B1F", color:"white", border:"none", borderRadius:2, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'Jost',sans-serif" },
};

function badge(status) {
  const map = {
    pending:          { background:"#FEF3C7", color:"#92400E" },
    approved:         { background:"#D1FAE5", color:"#065F46" },
    declined:         { background:"#FEE2E2", color:"#991B1B" },
    preparing:        { background:"#FEE2E2", color:"#991B1B" },
    ready:            { background:"#FEF3C7", color:"#92400E" },
    delivered:        { background:"#D1FAE5", color:"#065F46" },
    confirmed:        { background:"#D1FAE5", color:"#065F46" },
    out_for_delivery: { background:"#DBEAFE", color:"#1E40AF" },
    cancelled:        { background:"#FEE2E2", color:"#991B1B" },
  };
  const s = map[status] || { background:"#F3F4F6", color:"#374151" };
  return { display:"inline-block", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:500, ...s };
}

const NAV = [
  { id:"overview",     icon:"📊", label:"Overview" },
  { id:"reservations", icon:"📅", label:"Reservations" },
  { id:"menu",         icon:"🍽️", label:"Manage Menu" },
  { id:"orders",       icon:"🛵", label:"Online Orders" },
];

const EMPTY = { name:"", desc:"", price:"", category:"breakfast", tag:"", img:"🍽️", imageUrl:"" };

export default function AdminDashboard() {
  const { menu, setMenu, reservations, setReservations, adminUser, handleLogout } = useApp();
  const [tab,           setTab]           = useState("overview");
  const [editItem,      setEditItem]      = useState(null);
  const [editForm,      setEditForm]      = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [newItem,       setNewItem]       = useState(null);
  const [newImageFile,  setNewImageFile]  = useState(null);
  const [toast,         setToast]         = useState(null);
  const [orders,        setOrders]        = useState([]);

  useEffect(() => {
    if (adminUser) {
      api.getOrders()
        .then(data => setOrders(data.orders))
        .catch(() => {});
    }
  }, [adminUser]);

  // ── Reservations ──────────────────────────────────────────────
  async function approveRes(id) {
    try {
      await api.updateReservationStatus(id, "approved");
      setReservations(r => r.map(x => (x._id===id||x.id===id) ? {...x, status:"approved"} : x));
      setToast("Reservation approved ✓");
    } catch { setToast("Failed to update"); }
  }

  async function declineRes(id) {
    try {
      await api.updateReservationStatus(id, "declined");
      setReservations(r => r.map(x => (x._id===id||x.id===id) ? {...x, status:"declined"} : x));
      setToast("Reservation declined");
    } catch { setToast("Failed to update"); }
  }

  // ── Menu ──────────────────────────────────────────────────────
  function openEdit(item) { setEditItem(item); setEditForm({...item}); setEditImageFile(null); }
  function openAdd()      { setNewItem({...EMPTY}); setNewImageFile(null); }

  async function saveEdit() {
    try {
      const data = await api.updateMenuItem(
        editForm._id || editForm.id,
        { name:editForm.name, desc:editForm.desc, price:Number(editForm.price), category:editForm.category, tag:editForm.tag, img:editForm.img, imageUrl:editForm.imageUrl||"" },
        editImageFile
      );
      setMenu(m => ({...m, [data.item.category]: m[data.item.category]?.map(x =>
        (x._id||x.id)===(data.item._id||data.item.id) ? data.item : x
      ) || []}));
      setEditItem(null);
      setEditImageFile(null);
      setToast("Menu item updated ✓");
    } catch { setToast("Failed to update item"); }
  }

  async function deleteItem(item) {
    try {
      await api.deleteMenuItem(item._id || item.id);
      setMenu(m => ({...m, [item.category]: m[item.category].filter(x =>
        (x._id||x.id) !== (item._id||item.id)
      )}));
      setToast("Item removed");
    } catch { setToast("Failed to delete item"); }
  }

  async function saveNew() {
    if (!newItem.name || !newItem.price) { alert("Name and price required"); return; }
    try {
      const data = await api.addMenuItem(
        { name:newItem.name, desc:newItem.desc, price:Number(newItem.price), category:newItem.category, tag:newItem.tag, img:newItem.img, imageUrl:newItem.imageUrl||"" },
        newImageFile
      );
      setMenu(m => ({...m, [data.item.category]: [...(m[data.item.category]||[]), data.item]}));
      setNewItem(null);
      setNewImageFile(null);
      setToast("Item added ✓");
    } catch { setToast("Failed to add item"); }
  }

  const pending  = reservations.filter(r => r.status==="pending").length;
  const allItems = [...(menu.breakfast||[]),...(menu.lunch||[]),...(menu.dinner||[])];
  const curNav   = NAV.find(n => n.id===tab);

  const navBtnStyle = (active) => ({
    display:"flex", alignItems:"center", gap:12, padding:"14px 28px",
    fontSize:13, color: active ? "#F5EFE4" : "rgba(245,239,228,0.65)",
    background: active ? "rgba(255,255,255,0.08)" : "transparent",
    borderLeft: active ? "3px solid #C9A84C" : "3px solid transparent",
    borderTop:"none", borderRight:"none", borderBottom:"none",
    width:"100%", textAlign:"left", cursor:"pointer",
    fontFamily:"'Jost',sans-serif", transition:"all 0.2s",
  });

  return (
    <div style={S.layout}>

      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.userCard}>
            <div style={S.avatar}>{adminUser?.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={S.userName}>{adminUser?.name}</div>
              <div style={S.userRole}>{adminUser?.role}</div>
            </div>
          </div>
        </div>
        <div style={S.navLabel}>Navigation</div>
        {NAV.map(n => (
          <button key={n.id} style={navBtnStyle(tab===n.id)} onClick={() => setTab(n.id)}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
        <div style={{marginTop:"auto", padding:"24px 20px", borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <button style={S.signoutBtn} onClick={handleLogout}>← Sign Out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={S.content}>
        <div style={S.topbar}>
          <div style={S.topbarTitle}>{curNav?.icon} {curNav?.label}</div>
          <div style={{display:"flex", alignItems:"center", gap:16}}>
            <div style={S.userPill}>
              <div style={S.pillAvatar}>{adminUser?.avatar}</div>
              <div>
                <div style={S.pillName}>{adminUser?.name}</div>
                <div style={S.pillRole}>{adminUser?.role}</div>
              </div>
            </div>
            <button style={S.logoutBtn} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>

        <div style={S.page}>

          {/* ── OVERVIEW ── */}
          {tab==="overview" && <>
            <div style={S.pageTitle}>Good morning 👋</div>
            <div style={S.pageSubtitle}>Here's what's happening at Maison Dorée today.</div>
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <div style={S.statVal}>{reservations.length}</div>
                <div style={S.statLabel}>Total Reservations</div>
                <div style={S.statUp}>↑ 12% this week</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statVal}>{pending}</div>
                <div style={S.statLabel}>Pending Approval</div>
                <div style={pending>0?S.statDown:S.statUp}>{pending>0?"Needs attention":"All clear"}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statVal}>{allItems.length}</div>
                <div style={S.statLabel}>Menu Items</div>
                <div style={S.statUp}>All categories</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statVal}>₹24.2k</div>
                <div style={S.statLabel}>Today's Revenue</div>
                <div style={S.statUp}>↑ 8% vs yesterday</div>
              </div>
            </div>
            <div style={S.tableWrap}>
              <div style={S.tableHead}><span style={S.tableTitle}>Recent Reservations</span></div>
              <table style={S.table}>
                <thead><tr>
                  <th style={S.th}>Guest</th>
                  <th style={S.th}>Date & Time</th>
                  <th style={S.th}>Guests</th>
                  <th style={S.th}>Status</th>
                </tr></thead>
                <tbody>
                  {reservations.slice(0,4).map((r,i) => (
                    <tr key={r._id||r.id||i}>
                      <td style={S.td}><strong>{r.name}</strong><br/><span style={{color:"#8A7E74",fontSize:12}}>{r.email}</span></td>
                      <td style={S.td}>{r.date}<br/><span style={{color:"#8A7E74",fontSize:12}}>{r.time}</span></td>
                      <td style={S.td}>{r.guests} pax</td>
                      <td style={S.td}><span style={badge(r.status)}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}

          {/* ── RESERVATIONS ── */}
          {tab==="reservations" && <>
            <div style={S.pageTitle}>Reservations</div>
            <div style={S.pageSubtitle}>{reservations.length} total · {pending} pending approval</div>
            <div style={S.tableWrap}>
              <div style={S.tableHead}><span style={S.tableTitle}>All Bookings</span></div>
              <div style={{overflowX:"auto"}}>
                <table style={S.table}>
                  <thead><tr>
                    <th style={S.th}>Guest</th>
                    <th style={S.th}>Contact</th>
                    <th style={S.th}>Date & Time</th>
                    <th style={S.th}>Guests</th>
                    <th style={S.th}>Note</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {reservations.map((r,i) => (
                      <tr key={r._id||r.id||i}>
                        <td style={S.td}><strong>{r.name}</strong></td>
                        <td style={S.td}><span style={{fontSize:12}}>{r.email}<br/>{r.phone}</span></td>
                        <td style={S.td}>{r.date}<br/><span style={{color:"#8A7E74",fontSize:12}}>{r.time}</span></td>
                        <td style={S.td}>{r.guests}</td>
                        <td style={S.td}><span style={{fontSize:12,color:"#8A7E74"}}>{r.note||"—"}</span></td>
                        <td style={S.td}><span style={badge(r.status)}>{r.status}</span></td>
                        <td style={S.tdLast}>
                          {r.status==="pending" ? <>
                            <button style={S.approveBtn} onClick={() => approveRes(r._id||r.id)}>Approve</button>
                            <button style={S.declineBtn} onClick={() => declineRes(r._id||r.id)}>Decline</button>
                          </> : <span style={{fontSize:12,color:"#8A7E74"}}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* ── MENU ── */}
          {tab==="menu" && <>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32}}>
              <div>
                <div style={S.pageTitle}>Manage Menu</div>
                <div style={S.pageSubtitle}>{allItems.length} items across all categories</div>
              </div>
              <button style={S.addBtn} onClick={openAdd}>+ Add Item</button>
            </div>
            {["breakfast","lunch","dinner"].map(cat => (
              <div key={cat} style={{marginBottom:40}}>
                <div style={S.catTitle}>{cat}</div>
                <div style={S.tableWrap}>
                  <div style={{overflowX:"auto"}}>
                    <table style={S.table}>
                      <thead><tr>
                        <th style={S.th}>Item</th>
                        <th style={S.th}>Description</th>
                        <th style={S.th}>Price</th>
                        <th style={S.th}>Tag</th>
                        <th style={S.th}>Actions</th>
                      </tr></thead>
                      <tbody>
                        {(menu[cat]||[]).map((item,i) => (
                          <tr key={item._id||item.id||i}>
                            <td style={S.td}>
                              {item.imageUrl
                                ? <img src={item.imageUrl} alt={item.name} style={{width:40,height:40,objectFit:"cover",borderRadius:4,marginRight:8,verticalAlign:"middle"}}/>
                                : <span style={{fontSize:20,marginRight:8}}>{item.img}</span>
                              }
                              <strong>{item.name}</strong>
                            </td>
                            <td style={S.td}><span style={{fontSize:12,color:"#8A7E74"}}>{item.desc}</span></td>
                            <td style={S.td}><strong>₹{item.price}</strong></td>
                            <td style={S.td}>{item.tag && <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"#FEF3C7",color:"#92400E",fontWeight:500}}>{item.tag}</span>}</td>
                            <td style={S.tdLast}>
                              <button style={S.approveBtn} onClick={() => openEdit(item)}>Edit</button>
                              <button style={S.declineBtn} onClick={() => deleteItem(item)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </>}

          {/* ── ORDERS ── */}
          {tab==="orders" && <>
            <div style={S.pageTitle}>Online Orders</div>
            <div style={S.pageSubtitle}>Manage incoming delivery and pickup orders</div>
            <div style={S.tableWrap}>
              <div style={S.tableHead}><span style={S.tableTitle}>All Orders</span></div>
              <table style={S.table}>
                <thead><tr>
                  <th style={S.th}>Order ID</th>
                  <th style={S.th}>Customer</th>
                  <th style={S.th}>Items</th>
                  <th style={S.th}>Total</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Status</th>
                </tr></thead>
                <tbody>
                  {orders.length===0 && (
                    <tr><td colSpan={6} style={{...S.td, textAlign:"center", color:"#8A7E74"}}>No orders yet</td></tr>
                  )}
                  {orders.map((o,i) => (
                    <tr key={o._id||i}>
                      <td style={S.td}><strong>#{o._id?.slice(-6).toUpperCase()}</strong></td>
                      <td style={S.td}>{o.customer?.name}<br/><span style={{fontSize:12,color:"#8A7E74"}}>{o.customer?.phone}</span></td>
                      <td style={S.td}><span style={{fontSize:12,color:"#8A7E74"}}>{o.items?.map(x => `${x.name} x${x.qty}`).join(", ")}</span></td>
                      <td style={S.td}><strong>₹{o.total}</strong></td>
                      <td style={S.td}>{o.type}</td>
                      <td style={S.td}><span style={badge(o.status)}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}

        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editItem && (
        <div style={S.overlay} onClick={() => setEditItem(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>Edit Menu Item</div>
            {["name","desc","price","img","tag"].map(f => (
              <div key={f} style={S.formGroup}>
                <label style={S.formLabel}>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                <input style={S.formInput} value={editForm[f]||""} onChange={e => setEditForm(x => ({...x,[f]:e.target.value}))} />
              </div>
            ))}
            <div style={S.formGroup}>
              <label style={S.formLabel}>Image URL (optional)</label>
              <input style={S.formInput} value={editForm.imageUrl||""} onChange={e => setEditForm(x => ({...x,imageUrl:e.target.value}))} placeholder="https://..." />
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Upload Image (optional)</label>
              <input type="file" accept="image/*" style={{...S.formInput,padding:8}} onChange={e => setEditImageFile(e.target.files[0])} />
              {(editForm.imageUrl || editImageFile) && (
                <img src={editImageFile ? URL.createObjectURL(editImageFile) : editForm.imageUrl} alt="preview" style={{width:"100%",height:120,objectFit:"cover",borderRadius:4,marginTop:8}} />
              )}
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Category</label>
              <select style={S.formInput} value={editForm.category||"breakfast"} onChange={e => setEditForm(x => ({...x,category:e.target.value}))}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div style={S.modalActions}>
              <button style={S.cancelBtn} onClick={() => setEditItem(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Modal ── */}
      {newItem && (
        <div style={S.overlay} onClick={() => setNewItem(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>Add Menu Item</div>
            {["name","desc","price","img","tag"].map(f => (
              <div key={f} style={S.formGroup}>
                <label style={S.formLabel}>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                <input style={S.formInput} value={newItem[f]||""} onChange={e => setNewItem(x => ({...x,[f]:e.target.value}))} />
              </div>
            ))}
            <div style={S.formGroup}>
              <label style={S.formLabel}>Image URL (optional)</label>
              <input style={S.formInput} value={newItem.imageUrl||""} onChange={e => setNewItem(x => ({...x,imageUrl:e.target.value}))} placeholder="https://..." />
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Upload Image (optional)</label>
              <input type="file" accept="image/*" style={{...S.formInput,padding:8}} onChange={e => setNewImageFile(e.target.files[0])} />
              {(newItem.imageUrl || newImageFile) && (
                <img src={newImageFile ? URL.createObjectURL(newImageFile) : newItem.imageUrl} alt="preview" style={{width:"100%",height:120,objectFit:"cover",borderRadius:4,marginTop:8}} />
              )}
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Category</label>
              <select style={S.formInput} value={newItem.category} onChange={e => setNewItem(x => ({...x,category:e.target.value}))}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div style={S.modalActions}>
              <button style={S.cancelBtn} onClick={() => setNewItem(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={saveNew}>Add to Menu</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}