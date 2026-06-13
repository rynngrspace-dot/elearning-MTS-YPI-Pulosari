"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, GraduationCap, X, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { navConfig } from "@/app/lib/navConfig";
import {
  getStudentMapelsAction,
  getTeacherMapelsAction,
} from "@/lib/actions/pengampu-actions";
import { useEffect } from "react";
import Image from "next/image";

const roleMeta = {
  siswa: {
    label: "Portal Siswa",
    accent: "bg-indigo",
    accentLight: "bg-indigo-light",
    text: "text-indigo",
    border: "border-indigo-border",
  },
  guru: {
    label: "Portal Guru",
    accent: "bg-indigo",
    accentLight: "bg-indigo-light",
    text: "text-indigo",
    border: "border-indigo-border",
  },
  admin: {
    label: "Administrator",
    accent: "bg-indigo",
    accentLight: "bg-indigo-light",
    text: "text-indigo",
    border: "border-indigo-border",
  },
};

export default function Sidebar({ open, close }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [openMenus, setOpenMenus] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dynamicMapels, setDynamicMapels] = useState([]);

  // Fetch subjects for students
  useEffect(() => {
    if (user?.role === "STUDENT") {
      if (user?.kelasId) {
        const fetchMapels = async () => {
          const res = await getStudentMapelsAction(user.kelasId);
          if (res.success && res.data.length > 0) {
            setDynamicMapels(
              res.data.map((item) => ({
                label: item.mapel.nama,
                href: `/dashboard/siswa/mapel/${item.mapelId}`,
                id: item.mapelId,
              })),
            );
          }
        };
        fetchMapels();
      }
    }
  }, [user]);

  // Fetch subjects for teachers
  useEffect(() => {
    if (user?.role === "TEACHER" && user?.teacherId) {
      const fetchMapels = async () => {
        const res = await getTeacherMapelsAction(user.teacherId);
        if (res.success && res.data.length > 0) {
          setDynamicMapels(
            res.data.map((item) => ({
              label: `${item.mapel.nama} - ${item.kelas.nama}`,
              href: `/dashboard/guru/mapel/${item.id}`,
              id: item.id,
            })),
          );
        }
      };
      fetchMapels();
    }
  }, [user]);

  // Handle Auto-Expand Persistence
  useEffect(() => {
    const isSubjectRoute =
      pathname.includes("/mapel/") ||
      (queryId &&
        (pathname.includes("/tugas") || pathname.includes("/materi")));
    if (isSubjectRoute) {
      setOpenMenus((prev) => ({ ...prev, "Mata Pelajaran": true }));
    }
  }, [pathname, queryId]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const roleKey =
    user?.role === "TEACHER"
      ? "guru"
      : user?.role === "STUDENT"
        ? "siswa"
        : "admin";
  let items = navConfig[roleKey] ?? [];
  const meta = roleMeta[roleKey] || roleMeta.siswa;

  // Inject dynamic mapels if student or teacher
  if (roleKey === "siswa" || roleKey === "guru") {
    items = items.map((item) => {
      if (item.label === "Mata Pelajaran") {
        return { ...item, children: dynamicMapels };
      }
      return item;
    });
  }

  const isActive = (href, childId) => {
    // Exact match for main dashboard to avoid highlighting it when on sub-pages
    if (
      href === "/dashboard/admin" ||
      href === "/dashboard/guru" ||
      href === "/dashboard/siswa"
    ) {
      return pathname === href;
    }

    // Context-aware check for students:
    // If we have an 'id' in the URL (from Materi/Tugas filter), highlight the matching subject
    if (user?.role === "STUDENT" && queryId && childId === queryId) {
      return true;
    }

    // For other links, allow sub-path matches
    return pathname.startsWith(href);
  };

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* overlay mobile */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-screen
          w-[230px]
          z-50
          flex flex-col
          bg-surface
          border-r border-border
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* close mobile */}
        <div className="lg:hidden flex justify-end p-3">
          <button onClick={close}>
            <X size={18} />
          </button>
        </div>

        {/* logo */}
        <div className="px-5 pt-[10px] lg:pt-[22px] pb-[18px] border-b border-border">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-[10px] ${meta.accent} flex items-center justify-center`}
            >
              {/* <GraduationCap size={18} className="text-white" /> */}
              <Image
                src="/assets/images/logo-mts.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-jakarta font-extrabold text-[15px] text-ink">
                MTS YPI Pulosari
              </p>
              <p className="text-[11px] text-ink-3 mt-0.5">{meta.label}</p>
            </div>
          </div>
        </div>

        {/* nav */}
        <div className="flex-1 px-3 py-3.5 overflow-y-auto">
          <p className="text-[10px] font-bold tracking-[0.07em] uppercase text-ink-3 px-2 mb-2">
            Menu
          </p>

          <nav className="flex flex-col gap-0.5">
            {items.map((item) => {
              const { icon: Icon, label, href, children } = item;
              // A menu is a parent if it has children OR if it's explicitly designed to be a dropdown (like Mata Pelajaran)
              const hasChildren =
                (children && children.length > 0) || label === "Mata Pelajaran";
              const active = href
                ? isActive(href)
                : children &&
                  children.some((child) => isActive(child.href, child.id));
              const isOpen = openMenus[label];

              if (hasChildren) {
                return (
                  <div key={label} className="flex flex-col">
                    <button
                      onClick={() => toggleMenu(label)}
                      className={`flex items-center justify-between gap-2.5 px-2.5 py-[9px] rounded-[10px] text-[13.5px] transition-colors
                      ${
                        active && !isOpen
                          ? `${meta.accentLight} ${meta.text} font-semibold`
                          : "text-ink-2 hover:bg-cream"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                        {label}
                      </div>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="flex flex-col mt-0.5 ml-4 pl-4 border-l border-border gap-0.5">
                        {children &&
                          children.map((child) => {
                            const childActive = isActive(child.href, child.id);
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={close}
                                className={`px-2.5 py-[7px] rounded-[8px] text-[13px] transition-colors
                              ${
                                childActive
                                  ? `${meta.text} font-medium bg-cream`
                                  : "text-ink-3 hover:text-ink-2 hover:bg-cream/50"
                              }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={label}
                  href={href}
                  onClick={close}
                  className={`flex items-center gap-2.5 px-2.5 py-[9px] rounded-[10px] text-[13.5px] transition-colors
                  ${
                    active
                      ? `${meta.accentLight} ${meta.text} font-semibold`
                      : "text-ink-2 hover:bg-cream"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profil Section (Hidden if guest) */}
        {user && (
          <div className="px-3 pt-3 pb-2 border-t border-border">
            <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] bg-cream">
              <div
                className={`w-8 h-8 rounded-full border-2 ${meta.border} bg-white flex items-center justify-center overflow-hidden shrink-0`}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-ink-3">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-ink truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-[11px] text-ink-3 truncate">
                  {user?.role === "STUDENT"
                    ? user?.kelas || "Siswa"
                    : user?.role === "TEACHER"
                      ? user?.mapel || "Guru"
                      : "Administrator"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Logout/Back to Login Button */}
        <div className="px-3 pb-[18px] mt-auto">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2.5 p-2.5 px-3 hover:bg-red-50 rounded-lg transition-all text-ink-2 hover:text-red-600 group/logout disabled:opacity-50"
            title="Keluar dari sistem"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut
                size={16}
                className="group-hover/logout:scale-110 transition-transform"
              />
            )}
            <span className="text-[13.5px] font-medium">
              {user ? "Keluar Sistem" : "Reset Sesi / Login"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
