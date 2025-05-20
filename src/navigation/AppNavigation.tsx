// src/navigation/AppNavigation.tsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChangePassword from "../pages/auth/ChangePassword";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { getAuth } from "firebase/auth";

export default function AppNavigation() {
  const { loggedIn } = useAuth();
  const { initialized } = useUser();
  const firebaseAuth = getAuth();
  const currentUser = firebaseAuth.currentUser;
  const emailVerified = currentUser?.emailVerified ?? false;
  const location = useLocation();

  useEffect(() => {
    console.log("🏠 AppNavigation render", {
      path: location.pathname,
      loggedIn,
      initialized,
      emailVerified,
      user: currentUser?.email,
    });
  });

  return (
    <Routes>
      {loggedIn && initialized && emailVerified ? (
        <>
          <Route path="/*" element={<MainNavigation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}