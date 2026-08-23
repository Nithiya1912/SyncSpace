import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === "checking") return <FullScreenLoader />;
  if (status === "guest") return <Navigate to="/" replace />;

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { status } = useAuth();

  if (status === "checking") return <FullScreenLoader />;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;

  return children;
}

function FullScreenLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Loading SyncSpace…
    </div>
  );
}