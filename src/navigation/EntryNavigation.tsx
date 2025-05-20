import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChangePassword from "../pages/auth/ChangePassword";
import HomePage from "../pages/home/Home";

export default function EntryNavigation() {
  const location = useLocation();
  console.log("🔑 EntryNavigation render, path:", location.pathname);

  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}