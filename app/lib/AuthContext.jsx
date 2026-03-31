"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { logoutAction } from "../actions/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser }) {
  // Gunakan initialUser dari server jika ada, jika tidak fallback ke null
  const [user, setUser] = useState(initialUser || null);

  // Sync state ketika initialUser dari server berubah (misal setelah login/logout)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const switchRole = (role) => {
    // Fungsi ini hanya untuk demo/testing role di client
    setUser(prev => prev ? { ...prev, role: role.toUpperCase() } : null);
  };
  
  const logout = async () => {
    await logoutAction();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
