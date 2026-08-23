import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      <h1 style={{ fontSize: 48 }}>404</h1>
      <p style={{ color: "#64748b" }}>This page doesn't exist in SyncSpace.</p>
      <Link to="/" style={{ color: "#2563eb", fontWeight: 600 }}>
        Back to Login
      </Link>
    </div>
  );
}