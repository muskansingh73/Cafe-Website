import { useState } from "react";
import { useApp } from "../context/AppContext";

const TIME_SLOTS = [
  "7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM",
];

const INFO = [
  { icon: "📍", label: "Location",     val: "12 Marine Drive, South Mumbai, 400020" },
  { icon: "🕐", label: "Opening Hours", val: "Breakfast 7–11 AM · Lunch 12–3 PM · Dinner 6–11 PM" },
  { icon: "📞", label: "Phone",        val: "+91 22 4567 8900" },
  { icon: "✉️", label: "Email",        val: "hello@maisondoree.in" },
];

export default function ReservationPage() {
  const { addReservation } = useApp();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", date: "", time: "", guests: "2", note: "",
  });
  const [done, setDone] = useState(false);

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function submit() {
    if (!form.name || !form.email || !form.date || !form.time) {
      alert("Please fill in all required fields.");
      return;
    }
    addReservation(form);
    setDone(true);
  }

  if (done) return (
    <section
      className="section"
      style={{ paddingTop: 120, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="success-box">
        <div className="success-icon">🎉</div>
        <h2 className="success-title">Reservation Received!</h2>
        <p className="success-text">
          Thank you, {form.name}! We've received your booking for {form.guests} guest(s)
          on {form.date} at {form.time}. We'll confirm via email shortly.
        </p>
        <button className="btn-primary" onClick={() => setDone(false)}>
          Make Another Booking
        </button>
      </div>
    </section>
  );

  return (
    <section className="section section-alt" style={{ paddingTop: 120 }}>
      <div className="reservation-wrap">
        {/* ── Left info ── */}
        <div className="res-info">
          <div className="section-eyebrow" style={{ justifyContent: "flex-start" }}>
            Book a Table
          </div>
          <h2>Reserve Your <em>Experience</em></h2>
          <p>
            We'd love to host you. Fill in your details and we'll confirm your
            booking within 2 hours. For same-day reservations, please call us directly.
          </p>
          <div className="res-details">
            {INFO.map(d => (
              <div key={d.label} className="res-detail-item">
                <div className="res-icon">{d.icon}</div>
                <div>
                  <div className="res-detail-label">{d.label}</div>
                  <div className="res-detail-val">{d.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <div className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Sophie Laurent" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="sophie@email.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label>Guests</label>
              <select name="guests" value={form.guests} onChange={handle}>
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input name="date" type="date" value={form.date} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Preferred Time *</label>
              <select name="time" value={form.time} onChange={handle}>
                <option value="">Select time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handle}
              placeholder="Dietary requirements, special occasions, seating preferences…"
            />
          </div>
          <button className="form-submit" onClick={submit}>
            Confirm Reservation
          </button>
        </div>
      </div>
    </section>
  );
}
