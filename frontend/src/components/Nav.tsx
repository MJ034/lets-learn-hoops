import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setLogoutError(null);
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const authIsLoading = status === "idle" || status === "loading";

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <NavLink className="site-brand" to="/">
          Lets Learn Hoops
        </NavLink>

        <div className="site-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/learn">Learn</NavLink>
        </div>

        <div className="nav-auth" aria-live="polite">
          {authIsLoading ? (
            <span className="nav-auth-placeholder" aria-label="Checking session" />
          ) : status === "authenticated" && user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button type="button" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="nav-register" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {logoutError ? <p className="nav-error">{logoutError}</p> : null}
    </header>
  );
}
