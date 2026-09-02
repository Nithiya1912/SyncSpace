import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontFamily: "system-ui, sans-serif",
    }}>
      <h2>Password reset coming soon</h2>
      <p style={{ color: "#64748b" }}>This feature isn't built yet.</p>
      <Link to="/" style={{ color: "#2563eb", fontWeight: 600 }}>
        Back to Login
      </Link>
    </div>
  );
}