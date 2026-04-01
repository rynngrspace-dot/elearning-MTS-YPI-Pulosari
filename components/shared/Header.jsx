
"use client";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { pageTitles } from "@/app/lib/navConfig";

export default function Header({ toggleSidebar }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const title = pageTitles[pathname] ?? "Dashboard";
  const isTeacher = user?.role?.toLowerCase() === "teacher" || user?.role?.toLowerCase() === "guru";
  const accent = isTeacher ? "#6366F1" : "#0EA5A0";

  const hari = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-4 md:px-8 lg:px-12 h-16 shrink-0 bg-white border-b border-zinc-200">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* mobile menu */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-zinc-100"
        >
          <Menu size={18} />
        </button>

        <div>
          <p className="text-[11px] text-zinc-400 mb-[2px] capitalize hidden sm:block">
            {hari}
          </p>

          <h1 className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[17px] font-bold text-zinc-900">
            {title}
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* search desktop */}
        <div className="hidden md:flex items-center gap-2 bg-[#F7F7F5] border border-zinc-200 rounded-lg px-3 py-[7px] w-[210px]">
          <Search size={13} className="text-zinc-400 shrink-0" />

          <input
            type="text"
            placeholder={
              isTeacher
                ? "Cari siswa, materi..."
                : "Cari materi, tugas..."
            }
            className="bg-transparent outline-none text-[13px] text-zinc-600 w-full font-['DM_Sans']"
          />
        </div>

        {/* bell */}
        <button className="relative w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
          <Bell size={15} className="text-zinc-600" />

          <span
            className="absolute top-2 right-2 w-[6px] h-[6px] rounded-full border-[1.5px] border-white"
            style={{ background: accent }}
          />
        </button>

        {/* avatar */}
        <div className="w-8 h-8 rounded-full border-2 border-zinc-200 cursor-pointer bg-zinc-100 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-zinc-400">
              {user?.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
