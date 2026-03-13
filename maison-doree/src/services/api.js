const BASE_URL = "https://cafe-website-dzdc.onrender.com";

async function request(path, options = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  // ── AUTH ──────────────────────────────────────────────────────
  login: (body) => request("/api/auth/login", { method:"POST", body:JSON.stringify(body) }),

  // ── MENU ──────────────────────────────────────────────────────
  getMenu: () => request("/api/menu"),
  addMenuItem: (body) => request("/api/menu", { method:"POST", body:JSON.stringify(body) }),
  updateMenuItem: (id, body) => request(`/api/menu/${id}`, { method:"PUT", body:JSON.stringify(body) }),
  deleteMenuItem: (id) => request(`/api/menu/${id}`, { method:"DELETE" }),

  // ── RESERVATIONS ──────────────────────────────────────────────
  createReservation: (body) => request("/api/reservations", { method:"POST", body:JSON.stringify(body) }),
  getReservations: () => request("/api/reservations"),
  updateReservationStatus: (id, status) => request(`/api/reservations/${id}/status`, { method:"PATCH", body:JSON.stringify({ status }) }),

  // ── ORDERS ────────────────────────────────────────────────────
  createOrder: (body) => request("/api/orders", { method:"POST", body:JSON.stringify(body) }),
  getOrders: () => request("/api/orders"),
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, { method:"PATCH", body:JSON.stringify({ status }) }),
};