const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  // ── AUTH ──────────────────────────────────────────────────────
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  // ── MENU ──────────────────────────────────────────────────────
  getMenu: () => request("/api/menu"),

  // ── RESERVATIONS ──────────────────────────────────────────────
  createReservation: (body) => request("/api/reservations", { method: "POST", body: JSON.stringify(body) }),
  getReservations: () => request("/api/reservations"),
  updateReservationStatus: (id, status) => request(`/api/reservations/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // ── ORDERS ────────────────────────────────────────────────────
  createOrder: (body) => request("/api/orders", { method: "POST", body: JSON.stringify(body) }),
  getOrders: () => request("/api/orders"),
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};