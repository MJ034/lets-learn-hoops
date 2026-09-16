import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import LoginPage from "./pages/LoginPage";
import ProgressPage from "./pages/ProgressPage";
import RegisterPage from "./pages/Register";

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
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/:slug" element={<LessonDetailPage />} />
        <Route path="login" element={<LoginRoute />} />
        <Route path="register" element={<RegisterRoute />} />
        <Route element={<ProtectedRoute />}>
          <Route path="progress" element={<ProgressPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}