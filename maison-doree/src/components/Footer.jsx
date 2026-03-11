import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { setPage } = useApp();
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef(null);

  function handleSecretClick() {
    const next = clicks + 1;
    setClicks(next);
    clearTimeout(timerRef.current);
    if (next >= 5) {
      setClicks(0);
      setPage("admin");
      return;
    }
    timerRef.current = setTimeout(() => setClicks(0), 2000);
  }

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Maison Dorée</h3>
          <p>A sanctuary for exceptional dining experiences, nestled in the heart of Mumbai. Every visit is a story worth telling.</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li onClick={() => setPage("menu")}>Breakfast Menu</li>
            <li onClick={() => setPage("menu")}>Lunch Menu</li>
            <li onClick={() => setPage("menu")}>Dinner Menu</li>
            <li onClick={() => setPage("order")}>Order Online</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Visit</h4>
          <ul>
            <li>12 Marine Drive</li>
            <li>South Mumbai, 400020</li>
            <li>+91 22 4567 8900</li>
            <li>hello@maisondoree.in</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Hours</h4>
          <ul>
            <li>Breakfast: 7 – 11 AM</li>
            <li>Lunch: 12 – 3 PM</li>
            <li>Dinner: 6 – 11 PM</li>
            <li>Open 7 days a week</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div
          className="footer-copy"
          onClick={handleSecretClick}
          style={{ cursor: "default", userSelect: "none" }}
        >
          © 2026 Maison Dorée. All rights reserved.
          {clicks > 0 && clicks < 5 && (
            <span style={{ opacity: 0.3, marginLeft: 8, fontSize: 10 }}>
              {Array(clicks).fill("·").join("")}
            </span>
          )}
        </div>
        <div className="footer-copy">Crafted with ♥ for exceptional dining</div>
      </div>
    </footer>
  );
}
