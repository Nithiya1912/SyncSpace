import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/common/AppShell";

export default function Profile() {
  const { user } = useAuth();

  return (
    <AppShell title="Profile">
      <div style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="text-muted" style={{ display: "block", marginBottom: 4 }}>
            Name
          </label>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{user?.name || "—"}</div>
        </div>
        <div>
          <label className="text-muted" style={{ display: "block", marginBottom: 4 }}>
            Email
          </label>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{user?.email || "—"}</div>
        </div>
      </div>
    </AppShell>
  );
}