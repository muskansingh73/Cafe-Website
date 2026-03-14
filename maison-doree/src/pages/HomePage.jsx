import { useApp } from "../context/AppContext";
import MenuCard from "../components/MenuCard";

export default function HomePage() {
  const { setPage, addToCart, menu} = useApp();
  

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Est. 2018 · Mumbai</div>
          <h1 className="hero-h1">
            Where Every Meal Becomes a <em>Memory</em>
          </h1>
          <p className="hero-desc">
            From sun-drenched breakfasts to candlelit dinners, Maison Dorée is a
            sanctuary for those who believe food is the finest art.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("reservation")}>
              Book a Table
            </button>
            <button className="btn-secondary" onClick={() => setPage("menu")}>
              View Menu
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-val">12+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div>
              <div className="stat-val">240</div>
              <div className="stat-label">Covers Available</div>
            </div>
            <div>
              <div className="stat-val">4.9★</div>
              <div className="stat-label">Guest Rating</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-grid">
            {[
              { e: "🥐", l: "Breakfast" },
              { e: "🍝", l: "Lunch" },
              { e: "🥩", l: "Dinner" },
              { e: "🍷", l: "Fine Wines" },
            ].map(it => (
              <div key={it.l} className="hero-img-card">
                <div className="emoji">{it.e}</div>
                <div className="label">{it.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DISHES ── */}
      <section className="section section-alt">
        <div className="section-header">
          <div className="section-eyebrow">Signature Dishes</div>
          <h2 className="section-title">Crafted with <em>Passion</em></h2>
          <p className="section-sub">
            Each plate is a story told through seasonal ingredients and classical technique.
          </p>
        </div>
        <div className="menu-grid">
          {[...(menu.breakfast||[]), ...(menu.lunch||[]), ...(menu.dinner||[])]
  .slice(0, 3)
  .map((item, i) => (
    <MenuCard key={item._id||item.id||i} item={item} onAdd={addToCart} />
  ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="btn-primary" onClick={() => setPage("menu")}>
            Explore Full Menu
          </button>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">The Maison Experience</div>
          <h2 className="section-title">More Than a <em>Restaurant</em></h2>
        </div>
        <div
          className="features-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}
        >
          {[
            {
              icon: "🌿",
              title: "Farm to Table",
              desc: "We source directly from local farmers and artisan producers, ensuring every ingredient is at peak freshness.",
            },
            {
              icon: "👨‍🍳",
              title: "Michelin-Trained Chefs",
              desc: "Our kitchen brigade brings decades of fine-dining experience from Paris, Tokyo and New York.",
            },
            {
              icon: "🍷",
              title: "Curated Wine Cellar",
              desc: "Over 300 labels spanning Old World classics and exciting New World discoveries, perfectly paired.",
            },
          ].map(f => (
            <div
              key={f.title}
              style={{ padding: 40, background: "var(--cream)", borderRadius: 4, textAlign: "center" }}
            >
              <div style={{ fontSize: 44, marginBottom: 20 }}>{f.icon}</div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  color: "var(--brown)",
                  marginBottom: 12,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "var(--brown)", padding: "80px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 4vw, 54px)",
            fontWeight: 300,
            color: "var(--cream)",
            marginBottom: 16,
          }}
        >
          Ready for an <em style={{ color: "var(--gold)" }}>Unforgettable</em> Evening?
        </div>
        <p style={{ fontSize: 16, color: "rgba(245,239,228,0.7)", marginBottom: 40, fontWeight: 300 }}>
          Reserve your table today — weekends fill up fast.
        </p>
        <button
          className="btn-secondary"
          style={{ borderColor: "var(--gold-light)", color: "var(--gold-light)" }}
          onClick={() => setPage("reservation")}
        >
          Make a Reservation
        </button>
      </section>
    </>
  );
}
