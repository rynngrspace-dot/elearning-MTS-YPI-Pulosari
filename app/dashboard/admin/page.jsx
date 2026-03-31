"use client";

import { 
  ChevronRight, 
  Users, 
  School, 
  BookMarked, 
  CalendarClock, 
  UserRoundCheck, 
  BarChart3, 
  Activity,
  UserPlus,
  PlusCircle,
  FileText
} from "lucide-react";
import Link from "next/link";

const stats = [
  { icon:Users, label:"Total Siswa", value:"452", color:"#6366F1", bg:"bg-indigo-100", href:"/dashboard/admin/siswa" },
  { icon:UserRoundCheck, label:"Total Guru", value:"38", color:"#0EA5A0", bg:"bg-teal-100", href:"/dashboard/admin/guru" },
  { icon:School, label:"Total Kelas", value:"12", color:"#F59E0B", bg:"bg-amber-100", href:"/dashboard/admin/kelas" },
  { icon:BookMarked, label:"Mata Pelajaran", value:"24", color:"#EC4899", bg:"bg-pink-100", href:"/dashboard/admin/mapel" },
];

const recentActivity = [
  { user:"Admin", action:"Menambahkan Siswa Baru", target:"Andi Wijaya", time:"5 menit yang lalu" },
  { user:"Pak Hendra", action:"Mengunggah Materi", target:"Matematika X-A", time:"15 menit yang lalu" },
  { user:"Admin", action:"Update Tahun Ajaran", target:"2025/2026", time:"1 jam yang lalu" },
  { user:"Ibu Siti", action:"Input Nilai", target:"Bahasa Inggris X-B", time:"2 jam yang lalu" },
];

export default function AdminPage() {
  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_0.3s_ease_both]">

      {/* Banner */}
      <div className="relative flex items-center justify-between min-h-[110px] rounded-2xl px-7 py-6 bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden">
        
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/10 -right-16 -top-16" />

        <div className="relative z-10">
          <p className="text-[13px] text-white/80 mb-1">Panel Administrator 👋</p>
          <p className="font-bold text-[22px] text-white mb-1">Sistem Pusat E-Learning</p>
          <p className="text-[13px] text-white/70">Kelola seluruh data akademik dan pengguna di sini.</p>
        </div>

        <div className="relative z-10 text-right">
          <p className="text-[11px] text-white/60 mb-1">Selasa, 10 Maret 2025</p>
          <p className="text-[13px] font-semibold text-white/90">Tahun Ajaran 2024/2025 (Genap)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5">
        {stats.map(({ icon:Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href} className="no-underline">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 flex items-center gap-3.5 cursor-pointer hover:shadow-md transition">
              
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={20} style={{ color }}/>
              </div>

              <div>
                <p className="font-bold text-2xl text-zinc-900 leading-tight">{value}</p>
                <p className="text-[11.5px] text-zinc-400 mt-1">{label}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_320px] gap-4 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-4">

          {/* Activity */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-[15px] text-zinc-900">🕒 Aktivitas Terbaru</p>
              <button className="text-[13px] font-medium text-orange-500 hover:underline">Bersihkan</button>
            </div>

            <div className="flex flex-col gap-3">
              {recentActivity.map((a, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-3 ${
                    i !== recentActivity.length - 1 ? "pb-3 border-b border-dashed border-zinc-200" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
                    <Activity size={16} className="text-zinc-400"/>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-900">
                      {a.user} <span className="font-normal text-zinc-500">{a.action}</span>
                    </p>
                    <p className="text-xs text-orange-500 font-medium">{a.target}</p>
                  </div>

                  <p className="text-[11px] text-zinc-400">{a.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-[13px] text-green-800 font-semibold mb-2">Koneksi Server</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                <p className="text-base font-bold text-green-900">Stabil (99.9%)</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-[13px] text-blue-800 font-semibold mb-2">Penyimpanan Data</p>
              <p className="text-base font-bold text-blue-900">24.5 GB / 100 GB</p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3.5">

          {/* Quick Actions */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            <p className="font-semibold text-sm text-zinc-900 mb-3">⚡ Pintasan Admin</p>

            <div className="flex flex-col gap-2">
              {[
                { label:"Tambah Siswa", href:"/dashboard/admin/siswa", icon:UserPlus, color:"#6366F1", bg:"bg-indigo-100" },
                { label:"Lokal Kelas", href:"/dashboard/admin/kelas", icon:PlusCircle, color:"#0EA5A0", bg:"bg-teal-100" },
                { label:"Atur Mapel", href:"/dashboard/admin/mapel", icon:BookMarked, color:"#EC4899", bg:"bg-pink-100" },
                { label:"Tahun Ajaran", href:"/dashboard/admin/tahun-ajaran", icon:CalendarClock, color:"#F59E0B", bg:"bg-amber-100" },
                { label:"Report Sistem", href:"#", icon:BarChart3, color:"#10B981", bg:"bg-emerald-100" }
              ].map(a => (
                <Link key={a.label} href={a.href}>
                  <div className={`flex items-center gap-3 px-3.5 py-3 rounded-xl ${a.bg} hover:scale-[1.01] transition`}>
                    
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      <a.icon size={16} style={{ color: a.color }} strokeWidth={2.5}/>
                    </div>

                    <p className="text-[13.5px] font-semibold flex-1" style={{ color: a.color }}>
                      {a.label}
                    </p>

                    <ChevronRight size={13} style={{ color: a.color }}/>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Backup */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex gap-3">
              
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
                <FileText size={18} className="text-white"/>
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-800">Backup Data</p>
                <p className="text-xs text-amber-700 mt-1">
                  Terakhir: 3 jam yang lalu. Backup otomatis aktif setiap jam 00:00.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}