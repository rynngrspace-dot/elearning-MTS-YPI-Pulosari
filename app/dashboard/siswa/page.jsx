"use client";

import { ChevronRight, ClipboardList, UserCheck, BookOpen } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: ClipboardList, label: "Tugas Aktif", value: "4", color: "#6366F1", bg: "bg-indigo-100", href: "/dashboard/siswa/tugas" },
  { icon: UserCheck, label: "Kehadiran", value: "94%", color: "#16A34A", bg: "bg-green-100", href: "/dashboard/siswa/absensi" },
  { icon: BookOpen, label: "Materi Baru", value: "3", color: "#0EA5A0", bg: "bg-teal-100", href: "/dashboard/siswa/materi" },
];

const jadwal = [
  { jam: "07.00–08.30", mapel: "Matematika", guru: "Pak Hendra", ruang: "R.12", warna: "#0EA5A0", aktif: false },
  { jam: "08.30–10.00", mapel: "B. Indonesia", guru: "Bu Sari", ruang: "R.12", warna: "#6366F1", aktif: true },
  { jam: "10.15–11.45", mapel: "Fisika", guru: "Pak Rudi", ruang: "Lab IPA", warna: "#F59E0B", aktif: false },
  { jam: "12.30–14.00", mapel: "B. Inggris", guru: "Bu Dewi", ruang: "R.12", warna: "#EC4899", aktif: false },
];

const tugas = [
  { mapel: "Matematika", judul: "Latihan Integral", deadline: "Besok, 23:59", urgent: true },
  { mapel: "Fisika", judul: "Laporan Praktikum", deadline: "Jum'at, 23:59", urgent: false },
  { mapel: "B. Indonesia", judul: "Esai Argumentatif", deadline: "Senin, 23:59", urgent: false },
];

export default function SiswaPage() {
  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_0.3s_ease_both]">

      {/* Banner */}
      <div className="relative flex items-center justify-between min-h-[110px] rounded-2xl px-7 py-6 bg-gradient-to-br from-teal-500 to-teal-600 overflow-hidden">
        
        <div className="absolute w-[180px] h-[180px] rounded-full bg-white/10 -right-12 -top-12" />
        <div className="absolute w-[110px] h-[110px] rounded-full bg-white/5 right-20 -bottom-12" />

        <div className="relative z-10">
          <p className="text-[13px] text-white/70 mb-1">Selamat datang kembali 👋</p>
          <p className="text-[22px] font-bold text-white">Budi Santoso</p>
          <p className="text-[13px] text-white/60">Kelas X-A · SMAN 1 Bandung</p>
        </div>

        <div className="relative z-10 text-right">
          <p className="text-[11px] text-white/50">Semester Genap 2024/2025</p>
          <p className="text-[13px] font-semibold text-white/90">Pekan ke-18</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3.5">
        {stats.map(({ icon: Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 flex items-center gap-3.5 hover:shadow-md transition cursor-pointer">
              
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} style={{ color }} />
              </div>

              <div>
                <p className="text-2xl font-bold text-zinc-900 leading-tight">{value}</p>
                <p className="text-xs text-zinc-400 mt-1">{label}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Main */}
      <div className="grid grid-cols-[1fr_320px] gap-4 items-start">

        {/* Jadwal */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-[15px] font-semibold text-zinc-900">📅 Jadwal Hari Ini</p>
            <Link href="/dashboard/jadwal" className="flex items-center gap-1 text-sm text-teal-500 font-medium">
              Lihat semua <ChevronRight size={13}/>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {jadwal.map((j,i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                j.aktif ? "bg-teal-50 border-teal-200" : "bg-zinc-100 border-zinc-200"
              }`}>
                
                <div className="w-[3px] h-10 rounded-full" style={{ background: j.warna }} />

                <div className="w-[110px] text-xs text-zinc-400">
                  {j.jam}
                </div>

                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-zinc-900">{j.mapel}</p>
                  <p className="text-xs text-zinc-400">{j.guru} · {j.ruang}</p>
                </div>

                {j.aktif && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500 text-white font-semibold">
                    Sekarang
                  </span>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* Tugas */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-[15px] font-semibold text-zinc-900">📋 Tugas Mendatang</p>
            <Link href="/dashboard/tugas" className="flex items-center gap-1 text-sm text-teal-500 font-medium">
              Semua <ChevronRight size={13}/>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {tugas.map((t,i) => (
              <div key={i} className={`p-3.5 rounded-lg border ${
                t.urgent ? "bg-amber-50 border-amber-200" : "bg-zinc-100 border-zinc-200"
              }`}>
                
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[13.5px] font-semibold text-zinc-900">{t.judul}</p>
                  {t.urgent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                      Segera
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 mb-1">{t.mapel}</p>

                <p className={`text-xs font-medium ${
                  t.urgent ? "text-amber-700" : "text-zinc-400"
                }`}>
                  🕐 {t.deadline}
                </p>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}