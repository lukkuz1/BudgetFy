import React from "react";
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import HomePage from "../pages/home/Home";
import { useAuth } from "../hooks/useAuth";

export default function MainNavigation() {
  const { loggedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("🏡 MainNavigation render:");
  console.log(" • current path:", location.pathname);
  console.log(" • loggedIn:", loggedIn);

  const handleLogout = async () => {
    console.log("🔒 signing out...");
    await signOut();
    console.log("🔗 navigate to /login");
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <Link to="/">Pagrindinis</Link>
        {loggedIn && <button onClick={handleLogout}>Atsijungti</button>}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}