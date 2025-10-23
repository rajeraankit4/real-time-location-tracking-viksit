import { logout } from "../utils/auth";

export default function Dashboard() {
  function onLogout() {
    if (window.confirm("Are you sure you want to log out?")) {
      logout("/");
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={onLogout} style={{ marginTop: 12 }}>
        Logout
      </button>
    </div>
  );
}
