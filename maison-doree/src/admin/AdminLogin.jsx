import { useState } from "react";
import { useApp } from "@/context/AppContext";

const FEATURES = [
  { icon: "📅", text: "Manage reservations & approvals" },
  { icon: "🍽️", text: "Update menus across all categories" },
  { icon: "🛵", text: "Track and fulfil online orders" },
  { icon: "📊", text: "View revenue and booking analytics" },
];

export default function AdminLogin() {
  const { handleLogin } = useApp();
  const [form, setForm]       = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function submit() {
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      await handleLogin(form);
    } catch (err) {
      setError(err.message || "Invalid username or password.");
      setLoading(false);
    }
  }

  function handleKey(e) { if (e.key === "Enter") submit(); }

  return (
    <div className="login-page">
      {/* ── Left panel ── */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-logo">Maison <span>Dorée</span></div>
          <div className="login-brand-sub">Admin Portal</div>
          <div className="login-divider" />
          <div className="login-quote">
            "Great food is the foundation of genuine happiness."
          </div>
        </div>
        <div className="login-features">
          {FEATURES.map(f => (
            <div key={f.text} className="login-feature">
              <div className="login-feature-icon">{f.icon}</div>
              <div className="login-feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          <h1 className="login-title">Welcome <em>Back</em></h1>
          <p className="login-subtitle">
            Sign in to access the Maison Dorée admin dashboard.
          </p>

          <div className="login-hint">
            <strong>Demo credentials:</strong><br />
            Username: <strong>admin</strong> · Password: <strong>maison2026</strong><br />
            Username: <strong>manager</strong> · Password: <strong>doree123</strong>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handle}
              onKeyDown={handleKey}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="login-input-wrap">
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={handle}
                onKeyDown={handleKey}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                className="toggle-pwd"
                onClick={() => setShowPwd(s => !s)}
                type="button"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            className="form-submit"
            onClick={submit}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing in…" : "Sign In to Dashboard"}
          </button>

          <div className="login-footer-note">
            🔒 Secure admin access · Maison Dorée © 2026
          </div>
        </div>
      </div>
    </div>
  );
}