"use client";

import {
  Users,
  ClipboardList,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Video,
  CalendarClock,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusCfg = {
  hadir: {
    c: "#6366F1",
    bg: "bg-indigo-light",
    border: "border-indigo-100",
    label: "Hadir",
    icon: CheckCircle2,
  },
  terlambat: {
    c: "#EA580C",
    bg: "bg-orange-50",
    border: "border-orange-200",
    label: "Terlambat",
    icon: Clock,
  },
  sakit: {
    c: "#D97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Sakit",
    icon: AlertCircle,
  },
  alpha: {
    c: "#DC2626",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Alpha",
    icon: AlertCircle,
  },
};

export default function GuruDashboardClient({ data }) {
  const { teacher, stats, tugas, absensi, academic } = data;

  const statsItems = [
    {
      icon: Users,
      label: "Total Siswa",
      value: stats.totalStudents,
      color: "#6366F1",
      bg: "bg-indigo-light",
      href: "/dashboard/guru/rekap",
    },
    {
      icon: ClipboardList,
      label: "Tugas Aktif",
      value: stats.activeTasks,
      color: "#6366F1",
      bg: "bg-indigo-light",
      href: "/dashboard/guru/tugas",
    },
    {
      icon: CheckCircle2,
      label: "Presensi Hari Ini",
      value: stats.attendanceToday,
      color: "#6366F1",
      bg: "bg-indigo-light",
      href: "/dashboard/guru/absensi",
    },
    {
      icon: BookOpen,
      label: "Materi Diupload",
      value: stats.totalMaterials,
      color: "#6366F1",
      bg: "bg-indigo-light",
      href: "/dashboard/guru/materi",
    },
  ];

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8 flex flex-col gap-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative flex items-center justify-between min-h-[120px] rounded-2xl px-10 py-7 bg-gradient-to-br from-indigo to-indigo-hover overflow-hidden shadow-md border border-white/10">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 -right-20 -top-20 blur-3xl animate-pulse" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 -left-20 -bottom-20 blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <div className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/10">
              <p className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">
                Pendidik Aktif
              </p>
            </div>
            {academic && (
              <div className="px-2.5 py-1 bg-teal-500/20 backdrop-blur-md rounded-lg border border-teal-500/30">
                <p className="text-[9px] font-black text-teal-200 uppercase tracking-widest leading-none">
                  TA {academic.tahun} · {academic.semester}
                </p>
              </div>
            )}
          </div>
          <p className="font-bold text-2xl text-white tracking-tight leading-none mb-1.5">
            Selamat Datang, {teacher.name}
          </p>
          <p className="text-[12px] text-white/70 font-medium uppercase tracking-widest leading-relaxed">
            {teacher.subject} · MTS YPI Pulosari Limbangan
          </p>
        </div>

        <div className="relative z-10 text-right hidden md:block">
          <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest mb-1">
            {today}
          </p>
          <div className="flex items-center justify-end gap-2 text-white">
            <CalendarClock size={16} className="text-white/50" />
            <p className="text-[12px] font-black uppercase tracking-widest opacity-80">
              E-Learning Portal
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statsItems.map(({ icon: Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href} className="group">
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4 cursor-pointer hover:border-indigo/30 hover:shadow-md transition-all duration-300 relative overflow-hidden h-full">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Icon size={100} style={{ color }} />
              </div>

              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shadow-inner transition-colors",
                  bg,
                )}
              >
                <Icon size={20} style={{ color }} />
              </div>

              <div>
                <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1 leading-none">
                  {label}
                </p>
                <p className="font-bold text-2xl text-ink tracking-tighter leading-none">
                  {value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 items-start">
        {/* LEFT COMPONENT */}
        <div className="flex flex-col gap-8">
          {/* Tugas Card */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-8 overflow-hidden relative">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-ink uppercase tracking-tight leading-none mb-1.5">
                  📋 Tugas & Evaluasi
                </h3>
                <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-60">
                  Status Pengumpulan Terkini
                </p>
              </div>
              <Link
                href="/dashboard/guru/tugas"
                className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center text-ink hover:bg-indigo hover:text-white transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tugas.length > 0 ? (
                tugas.map((t, i) => {
                  const pct =
                    t.total > 0
                      ? Math.round((t.dikumpulkan / t.total) * 100)
                      : 0;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-6 rounded-xl border transition-all group",
                        t.urgent
                          ? "bg-indigo-50 border-indigo-100"
                          : "bg-cream/20 border-border hover:border-indigo/20",
                      )}
                    >
                      <div className="flex justify-between mb-3">
                        <div>
                          <h4 className="text-[13px] font-bold text-ink uppercase tracking-tight mb-1">
                            {t.judul}
                          </h4>
                          <p className="text-[9px] font-medium text-ink-3 uppercase tracking-widest opacity-60">
                            Kelas {t.kelas} · {t.deadline}
                          </p>
                        </div>
                        {t.urgent && (
                          <span className="h-fit px-3 py-1 bg-indigo text-white text-[8px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-indigo/20 animate-pulse">
                            Prioritas
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-border/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-black text-ink tabular-nums">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 py-10 flex flex-col items-center justify-center opacity-40 grayscale">
                  <ClipboardList size={40} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Belum ada tugas aktif
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Absensi Card */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-8 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-light border border-indigo-100 flex items-center justify-center text-indigo shadow-inner">
                  <CheckCircle2 size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink uppercase tracking-tight leading-none mb-1.5">
                    ✅ Presensi Kelas
                  </h3>
                  <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-60">
                    {absensi.length > 0
                      ? `${absensi.filter((a) => a.status === "hadir").length} Siswa Hadir Hari Ini`
                      : "Belum ada catatan hari ini"}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/guru/absensi"
                className="px-5 py-2.5 bg-ink text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                Input Presensi
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {absensi.length > 0 ? (
                absensi.map((s, i) => {
                  const cfg = statusCfg[s.status] || statusCfg.hadir;
                  const Icon = cfg.icon;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-[16px] border border-border bg-white transition-all hover:shadow-md group",
                        cfg.bg,
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center shadow-sm">
                        <span
                          className="text-[10px] font-bold uppercase"
                          style={{ color: cfg.c }}
                        >
                          {s.nama.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-ink uppercase truncate leading-none mb-1">
                          {s.nama}
                        </p>
                        <div className="flex items-center gap-1">
                          <Icon size={9} style={{ color: cfg.c }} />
                          <span
                            className="text-[8px] font-bold uppercase tracking-widest opacity-60"
                            style={{ color: cfg.c }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-10 flex flex-col items-center justify-center opacity-40 grayscale">
                  <CheckCircle2 size={40} className="mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Gunakan tombol di atas untuk input presensi harian
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT */}
        <div className="flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-8">
            <h3 className="font-black text-lg text-ink leading-none mb-2">
              ⚡ Navigasi Guru
            </h3>
            <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-6 leading-none">
              Akses Modul Pengajar
            </p>

            <div className="flex flex-col gap-3">
              {[
                {
                  label: "Lokal Presensi",
                  href: "/dashboard/guru/absensi",
                  icon: CheckCircle2,
                },
                {
                  label: "Mata Pelajaran",
                  href: "/dashboard/guru/mapel",
                  icon: BookMarked,
                },
                {
                  label: "Jadwal Mengajar",
                  href: "/dashboard/guru/jadwal",
                  icon: CalendarClock,
                },
                {
                  label: "Kelola Tugas",
                  href: "/dashboard/guru/tugas",
                  icon: ClipboardList,
                },
                {
                  label: "Jitsi Meet",
                  href: "/dashboard/guru/meet",
                  icon: Video,
                },
              ].map((a) => (
                <Link key={a.label} href={a.href} className="group">
                  <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-indigo-light border border-transparent hover:border-indigo/10 group-hover:scale-[1.01] transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      <a.icon
                        size={20}
                        className="text-indigo"
                        strokeWidth={2.5}
                      />
                    </div>
                    <p className="text-[13px] font-black text-indigo uppercase flex-1 tracking-tight">
                      {a.label}
                    </p>
                    <ChevronRight
                      size={14}
                      className="text-indigo/40 group-hover:text-indigo transition-colors"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pengumuman Placeholder */}
          <div className="bg-ink text-white rounded-2xl shadow-md p-8 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-all duration-700">
              <AlertCircle size={180} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-lg leading-none mb-1">
                    📢 Memo Sekolah
                  </h3>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">
                    Pengumuman Terbaru
                  </p>
                </div>
                <Link
                  href="/dashboard/guru/pengumuman"
                  className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    judul: "Jadwal UTS Semester Genap",
                    tgl: "10 Mar",
                    target: "Semua Kelas",
                  },
                  {
                    judul: "Pengumpulan Laporan Fisika",
                    tgl: "8 Mar",
                    target: "Kelas X-A",
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-all"
                  >
                    <h4 className="text-sm font-black uppercase tracking-tight mb-1">
                      {p.judul}
                    </h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {p.target} · {p.tgl}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
