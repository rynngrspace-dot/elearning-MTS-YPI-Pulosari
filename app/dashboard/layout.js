"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-(--cream)">
      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
