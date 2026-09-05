import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordRequest } from "../../services/authService";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const res = await forgotPasswordRequest(email.trim());
      setMessage(res.message || "If that account exists, a reset link has been sent.");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand">
          <div className="logo-circle">S</div>
          <h1 className="logo">SyncSpace</h1>
          <p className="subtitle">Reset your password</p>
        </div>

        {message && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: 12, borderRadius: 12, marginBottom: 20, fontSize: 14 }}>
            {message}
          </div>
        )}
        {error && <div className="error-banner">{error}</div>}

        {!message && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-icon">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 18 }}
                />
              </div>
            </div>

            <button type="submit" className="login-button" disabled={submitting}>
              {submitting ? <span className="spinner" /> : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="signup-text">
          <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}