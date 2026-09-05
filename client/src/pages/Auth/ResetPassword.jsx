import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordRequest } from "../../services/authService";
import "./Login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      await resetPasswordRequest(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
          <p className="subtitle">Set a new password</p>
        </div>

        {success ? (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: 12, borderRadius: 12, fontSize: 14 }}>
            Password updated! Redirecting to login…
          </div>
        ) : (
          <>
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="password">New Password</label>
                <div className="input-icon">
                  <input
                    id="password"
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: 18 }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: 18 }}
                  />
                </div>
              </div>

              <button type="submit" className="login-button" disabled={submitting}>
                {submitting ? <span className="spinner" /> : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p className="signup-text">
          <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}