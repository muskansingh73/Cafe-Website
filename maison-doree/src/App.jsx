import { useApp } from "./context/AppContext";

import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Toast       from "./components/Toast";

import HomePage      from "./pages/HomePage";
import MenuPage      from "./pages/MenuPage";
import ReservationPage from "./pages/ReservationPage";
import OrderPage     from "./pages/OrderPage";

import AdminLogin     from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  const { page, cartOpen, toast, setToast, adminUser } = useApp();

  // ── Admin flow ──────────────────────────────────────────────────────────
  if (page === "admin") {
    return (
      <>
        {!adminUser ? <AdminLogin /> : <AdminDashboard />}
        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      </>
    );
  }

  // ── Public site ─────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      {page === "home"        && <HomePage />}
      {page === "menu"        && <MenuPage />}
      {page === "reservation" && <ReservationPage />}
      {page === "order"       && <OrderPage />}

      <Footer />

      {cartOpen && <CartSidebar />}
      {toast    && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
