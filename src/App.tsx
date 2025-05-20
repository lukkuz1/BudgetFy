import React, { useEffect } from "react";
import AppNavigation from "./navigation/AppNavigation";
import { AuthProvider } from "./hooks/useAuth";
import { UserProvider } from "./hooks/useUser";

export default function App() {
  useEffect(() => {
    console.log("🟢 App mounted");
  }, []);

  return (
    <UserProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </UserProvider>
  );
}