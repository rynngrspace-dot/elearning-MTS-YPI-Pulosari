"use client";
import { createContext, useContext, useState } from "react";

// ------------------------------------------------------------
// Ganti bagian ini dengan session dari NextAuth / Clerk / dll
// saat sudah ada sistem autentikasi nyata.
// ------------------------------------------------------------
const MOCK_USER = {
  siswa: {
    nama: "Budi Santoso",
    kelas: "Kelas X-A",
    avatar: "https://i.pravatar.cc/32?img=12",
    role: "siswa",
  },
  guru: {
    nama: "Pak Hendra",
    mapel: "Matematika",
    avatar: "https://i.pravatar.cc/32?img=53",
    role: "guru",
  },
  admin: {
    nama: "Administrator",
    role: "admin",
    avatar: "https://i.pravatar.cc/32?img=32",
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Ubah "siswa" → "guru" → "admin" untuk preview tampilan
  const [user, setUser] = useState(MOCK_USER.admin);

  const switchRole = (role) => setUser(MOCK_USER[role]);

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
