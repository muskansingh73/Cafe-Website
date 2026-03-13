import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_MENU, INITIAL_RESERVATIONS } from "../data";
import { api } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage]                 = useState("home");
  const [menu, setMenu]                 = useState(INITIAL_MENU);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [cart, setCart]                 = useState([]);
  const [cartOpen, setCartOpen]         = useState(false);
  const [toast, setToast]               = useState(null);
  const [adminUser, setAdminUser]       = useState(null);
  const [token, setToken]               = useState(localStorage.getItem("adminToken") || null);
  const [loading, setLoading]           = useState(false);

  // Load menu from API on mount
  useEffect(() => {
    api.getMenu()
      .then(data => setMenu(data.menu))
      .catch(() => {});
  }, []);

  // Load reservations when admin logs in
  useEffect(() => {
    if (token && adminUser) {
      api.getReservations()
        .then(data => setReservations(data.reservations))
        .catch(() => {});
    }
  }, [token, adminUser]);

  function addToCart(item) {
    setCart(c => {
      const existing = c.find(x => x.id === item.id || x._id === item._id);
      if (existing) return c.map(x => (x.id === item.id || x._id === item._id) ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...item, qty: 1 }];
    });
    showToast(`${item.name} added to cart`);
  }

  function updateQty(id, delta) {
    setCart(c =>
      c.map(x => (x.id === id || x._id === id) ? { ...x, qty: Math.max(0, x.qty + delta) } : x)
       .filter(x => x.qty > 0)
    );
  }

  function clearCart() { setCart([]); }

  async function addReservation(form) {
    try {
      const data = await api.createReservation(form);
      setReservations(r => [data.reservation, ...r]);
    } catch (err) {
      setReservations(r => [...r, { ...form, id: Date.now(), status: "pending", guests: Number(form.guests) }]);
    }
  }

  async function handleLogin(credentials) {
    try {
      setLoading(true);
      const data = await api.login({
        username: credentials.username,
        password: credentials.password,
      });
      setToken(data.token);
      localStorage.setItem("adminToken", data.token);
      setAdminUser({ ...data.admin });
      showToast(`Welcome back, ${data.admin.name}!`);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem("adminToken");
    setPage("home");
    showToast("Signed out successfully.");
  }

  function showToast(msg) { setToast(msg); }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{
      page, setPage,
      menu, setMenu,
      reservations, setReservations,
      cart, cartOpen, setCartOpen, cartCount,
      toast, setToast,
      adminUser, token, loading,
      addToCart, updateQty, clearCart,
      addReservation, handleLogin, handleLogout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
