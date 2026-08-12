import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";

function HomePage() {
  const { user, logout } = useAuth();
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

  return (
    <main className="home-page">
      <h1>Lets Learn Hoops</h1>
      <p> Welcome{user?.name ? ", " + user.name : ""}. </p>

      {logoutError ? <p className="login-error">{logoutError}</p> : null}

      <button type="button" className="login-submit" onClick={handleLogout} disabled={loggingOut} >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </main>
  );
}

function ProtectedHomeRoute() {
  const { status } = useAuth();

  if (status === "idle" || status === "loading") {
    return <p>Checking session...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <HomePage />;
}

function LoginRoute() {
  const { status } = useAuth();

  if (status === "idle" || status === "loading") {
    return <p>Checking session...</p>;
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

function RegisterRoute() {
  const { status } = useAuth();

  if (status === "idle" || status === "loading") {
    return <p>Checking session...</p>;
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <RegisterPage />;
}


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />
      <Route path="/" element={<ProtectedHomeRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}