import { createContext, useContext, useState } from "react";
import { INITIAL_MENU, INITIAL_RESERVATIONS } from "../data";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage] = useState("home");
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  function addToCart(item) {
    setCart(c => {
      const existing = c.find(x => x.id === item.id);
      if (existing) return c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...item, qty: 1 }];
    });
    showToast(`${item.name} added to cart`);
  }

  function updateQty(id, delta) {
    setCart(c =>
      c.map(x => x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x)
       .filter(x => x.qty > 0)
    );
  }

  function clearCart() { setCart([]); }

  function addReservation(form) {
    setReservations(r => [
      ...r,
      { ...form, id: Date.now(), status: "pending", guests: Number(form.guests) },
    ]);
  }

  function handleLogin(account) {
    setAdminUser(account);
    showToast(`Welcome back, ${account.name}!`);
  }

  function handleLogout() {
    setAdminUser(null);
    setPage("home");
    showToast("Signed out successfully.");
  }

  function showToast(msg) {
    setToast(msg);
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{
      page, setPage,
      menu, setMenu,
      reservations, setReservations,
      cart, cartOpen, setCartOpen, cartCount,
      toast, setToast,
      adminUser,
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
