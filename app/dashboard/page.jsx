"use client";

import { useAuth } from "../lib/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndexPage() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user.role === "admin") {
      redirect("/dashboard/admin");
    } else if (user.role === "guru") {
      redirect("/dashboard/guru");
    } else {
      redirect("/dashboard/siswa");
    }
  }, [user.role]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}