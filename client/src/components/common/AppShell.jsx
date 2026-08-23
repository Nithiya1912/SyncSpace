import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AppShell.css";

export default function AppShell({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="shell">
      <aside className="shell-sidebar">
        <div className="shell-logo">
          <span className="shell-logo-mark">S</span> SyncSpace
        </div>
        <nav className="shell-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <button className="shell-logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="shell-main">
        <header className="shell-topbar">
          <h1>{title}</h1>
          {user && <span className="shell-user">{user.name || user.email}</span>}
        </header>
        <div className="shell-content">{children}</div>
      </main>
    </div>
  );
}