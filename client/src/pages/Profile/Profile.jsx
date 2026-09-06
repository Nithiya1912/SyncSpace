import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/common/AppShell";

export default function Profile() {
  const { user } = useAuth();

  return (
    <AppShell title="Profile">
      <div style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 20 }}>
          <label className="field-label">Name</label>
          <div className="field-value">{user?.name || "—"}</div>
        </div>

        <div>
          <label className="field-label">Email</label>
          <div className="field-value">{user?.email || "—"}</div>
        </div>
      </div>
    </AppShell>
  );
}