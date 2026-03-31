"use client";

import { ChevronRight, Users, ClipboardList, BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon:Users, label:"Total Siswa", value:"32", color:"#6366F1", bg:"bg-indigo-100", href:"/dashboard/guru/rekap" },
  { icon:ClipboardList, label:"Tugas Aktif", value:"5", color:"#0EA5A0", bg:"bg-teal-100", href:"/dashboard/guru/tugas" },
  { icon:CheckCircle2, label:"Sudah Absen Hari Ini", value:"28", color:"#16A34A", bg:"bg-green-100", href:"/dashboard/guru/absensi" },
  { icon:BookOpen, label:"Materi Diupload", value:"12", color:"#F59E0B", bg:"bg-amber-100", href:"/dashboard/guru/materi" },
];

const tugasAktif = [
  { judul:"Latihan Integral", kelas:"X-A", deadline:"Besok, 23:59", dikumpulkan:24, total:32, urgent:true },
  { judul:"Laporan Praktikum", kelas:"X-A", deadline:"Jum'at, 23:59", dikumpulkan:10, total:32, urgent:false },
  { judul:"Esai Argumentatif", kelas:"X-B", deadline:"Senin, 23:59", dikumpulkan:30, total:30, urgent:false },
  { judul:"Reading Comprehension", kelas:"X-A", deadline:"14 Mar, 23:59", dikumpulkan:32, total:32, urgent:false },
];

const absensiHariIni = [
  { nama:"Andi Wijaya", status:"hadir" },
  { nama:"Budi Santoso", status:"hadir" },
  { nama:"Citra Dewi", status:"terlambat" },
  { nama:"Dian Pratama", status:"sakit" },
  { nama:"Eka Rahayu", status:"hadir" },
  { nama:"Fajar Nugraha", status:"alpha" },
];

const statusCfg = {
  hadir:     { c:"#16A34A", bg:"bg-green-50", border:"border-green-200", label:"Hadir", icon:CheckCircle2 },
  terlambat: { c:"#EA580C", bg:"bg-orange-50", border:"border-orange-200", label:"Terlambat", icon:Clock },
  sakit:     { c:"#D97706", bg:"bg-amber-50", border:"border-amber-200", label:"Sakit", icon:AlertCircle },
  alpha:     { c:"#DC2626", bg:"bg-red-50", border:"border-red-200", label:"Alpha", icon:AlertCircle },
};

const pengumuman = [
  { judul:"Jadwal UTS Semester Genap", tgl:"10 Mar", target:"Semua Kelas" },
  { judul:"Pengumpulan Laporan Fisika", tgl:"8 Mar", target:"Kelas X-A" },
];

export default function GuruPage() {
  const hadir = absensiHariIni.filter(s => s.status === "hadir").length;

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_0.3s_ease_both]">

      {/* Banner */}
      <div className="relative flex items-center justify-between min-h-[110px] rounded-2xl px-7 py-6 bg-gradient-to-br from-indigo-500 to-indigo-600 overflow-hidden">
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/10 -right-16 -top-16" />

        <div className="relative z-10">
          <p className="text-[13px] text-white/70 mb-1">Selamat datang kembali 👋</p>
          <p className="text-[22px] font-bold text-white">Pak Hendra</p>
          <p className="text-[13px] text-white/60">Matematika · SMAN 1 Bandung</p>
        </div>

        <div className="relative z-10 text-right">
          <p className="text-[11px] text-white/50">Selasa, 10 Maret 2025</p>
          <p className="text-[13px] font-semibold text-white/90">Semester Genap · Pekan ke-18</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5">
        {stats.map(({ icon:Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href}>
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 flex items-center gap-3.5 hover:shadow-md transition cursor-pointer">
              
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} style={{ color }}/>
              </div>

              <div>
                <p className="text-2xl font-bold text-zinc-900 leading-tight">{value}</p>
                <p className="text-[11.5px] text-zinc-400 mt-1">{label}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Main */}
      <div className="grid grid-cols-[1fr_300px] gap-4 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-4">

          {/* Tugas */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-[15px] font-semibold text-zinc-900">📋 Tugas Aktif</p>
              <Link href="/dashboard/guru/tugas" className="flex items-center gap-1 text-sm text-indigo-500 font-medium">
                Kelola <ChevronRight size={13}/>
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {tugasAktif.map((t,i) => {
                const pct = Math.round((t.dikumpulkan/t.total)*100);

                return (
                  <div key={i} className={`p-3.5 rounded-xl ${t.urgent ? "bg-amber-50 border border-amber-200" : "bg-zinc-100 border border-zinc-200"}`}>
                    
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{t.judul}</p>
                        <p className="text-xs text-zinc-400">Kelas {t.kelas} · 🕐 {t.deadline}</p>
                      </div>

                      <div className="flex gap-1.5">
                        {t.urgent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">Segera</span>}
                        {pct===100 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">✓ Selesai</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            pct===100 ? "bg-green-500" : pct>=70 ? "bg-teal-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs font-semibold text-zinc-500">{t.dikumpulkan}/{t.total}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Absensi */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[15px] font-semibold text-zinc-900">✅ Absensi Hari Ini</p>
                <p className="text-xs text-zinc-400">{hadir}/{absensiHariIni.length} siswa hadir · Kelas X-A</p>
              </div>
              <Link href="/dashboard/guru/absensi" className="flex items-center gap-1 text-sm text-indigo-500 font-medium">
                Input <ChevronRight size={13}/>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {absensiHariIni.map((s,i) => {
                const cfg = statusCfg[s.status];
                const Icon = cfg.icon;

                return (
                  <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${cfg.bg} border ${cfg.border}`}>
                    
                    <div className="w-7 h-7 rounded-full bg-white border flex items-center justify-center">
                      <span className="text-[10px] font-bold" style={{ color: cfg.c }}>
                        {s.nama.charAt(0)}
                      </span>
                    </div>

                    <p className="text-[12.5px] font-medium text-zinc-900 truncate">{s.nama}</p>

                    <span className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white border font-semibold" style={{ color: cfg.c }}>
                      <Icon size={9}/> {cfg.label}
                    </span>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3.5">

          {/* Actions */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-semibold text-zinc-900 mb-3">⚡ Aksi Cepat</p>

            <div className="flex flex-col gap-2">
              {[
                { label:"Input Absensi", href:"/dashboard/guru/absensi", color:"text-indigo-500 bg-indigo-100" },
                { label:"Buat Tugas Baru", href:"/dashboard/guru/tugas", color:"text-teal-500 bg-teal-100" },
                { label:"Upload Materi", href:"/dashboard/guru/materi", color:"text-amber-500 bg-amber-100" },
                { label:"Input Nilai", href:"/dashboard/guru/nilai", color:"text-green-600 bg-green-100" },
                { label:"Buat Meet", href:"/dashboard/guru/meet", color:"text-pink-500 bg-pink-100" },
              ].map(a => (
                <Link key={a.label} href={a.href}>
                  <div className={`flex justify-between items-center px-3.5 py-2.5 rounded-xl ${a.color}`}>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <ChevronRight size={13}/>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pengumuman */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            
            <div className="flex justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-900">📢 Pengumuman</p>
              <Link href="/dashboard/guru/pengumuman" className="text-xs text-indigo-500 font-medium">
                Lihat semua
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {pengumuman.map((p,i) => (
                <div key={i} className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200">
                  <p className="text-sm font-medium text-zinc-900">{p.judul}</p>
                  <p className="text-[11px] text-zinc-400">{p.target} · {p.tgl}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}