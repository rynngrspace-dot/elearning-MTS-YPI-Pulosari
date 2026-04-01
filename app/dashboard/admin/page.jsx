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
import prisma from "@/lib/db";

export default async function AdminPage() {
  // Fetch real statistics from database
  const [
    totalSiswa,
    totalGuru,
    totalKelas,
    totalMapel,
    activeTA
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.kelas.count(),
    prisma.mataPelajaran.count(),
    prisma.tahunAjaran.findFirst({ where: { isActive: true } })
  ]);

  const stats = [
    { icon:Users, label:"Total Siswa", value:totalSiswa.toString(), color:"#6366F1", bg:"bg-indigo-100", unit:"siswa", href:"/dashboard/admin/siswa" },
    { icon:UserRoundCheck, label:"Total Guru", value:totalGuru.toString(), color:"#0EA5A0", bg:"bg-teal-100", unit:"guru", href:"/dashboard/admin/guru" },
    { icon:School, label:"Total Kelas", value:totalKelas.toString(), color:"#F59E0B", bg:"bg-amber-100", unit:"kelas", href:"/dashboard/admin/kelas" },
    { icon:BookMarked, label:"Mata Pelajaran", value:totalMapel.toString(), color:"#EC4899", bg:"bg-pink-100", unit:"mapel", href:"/dashboard/admin/mapel" },
  ];

  const recentActivity = [
    { user:"Admin", action:"Sistem Berhasil Dimigrasi", target:"Database V2", time:"Baru saja" },
    { user:"Admin", action:"Menambahkan Siswa Baru", target:"Andi Wijaya", time:"5 menit yang lalu" },
    { user:"Pak Jamil", action:"Status Wali Kelas", target:"X RPL 1", time:"15 menit yang lalu" },
  ];

  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="p-8 flex flex-col gap-6 animate-fadeIn">

      {/* Banner */}
      <div className="relative flex items-center justify-between min-h-[110px] rounded-[32px] px-8 py-7 bg-gradient-to-br from-indigo to-indigo-hover overflow-hidden shadow-2xl shadow-indigo/20 border border-white/10">
        
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 -right-20 -top-20 blur-3xl" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 -left-20 -bottom-20 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
               <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Administrator Active</p>
            </div>
          </div>
          <p className="font-black text-3xl text-white tracking-tight">Sistem Pusat E-Learning</p>
          <p className="text-[13px] text-white/70 font-medium mt-1 uppercase tracking-widest">SMP & SMK MTS YPI Pulosari</p>
        </div>

        <div className="relative z-10 text-right">
          <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest mb-1">{today}</p>
          <div className="flex items-center justify-end gap-2 text-white">
            <CalendarClock size={16} className="text-white/50" />
            <p className="text-[14px] font-black uppercase tracking-tighter">
              TA {activeTA ? `${activeTA.tahun} (${activeTA.semester})` : "Belum Diatur"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map(({ icon:Icon, label, value, color, bg, unit, href }) => (
          <Link key={label} href={href} className="no-underline group">
            <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col gap-4 cursor-pointer hover:border-indigo/30 hover:shadow-2xl hover:shadow-indigo/5 transition-all duration-300 relative overflow-hidden">
              
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <Icon size={100} style={{ color }}/>
              </div>

              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shadow-inner`}>
                <Icon size={22} style={{ color }}/>
              </div>

              <div>
                <p className="text-[11px] font-black text-ink-3 uppercase tracking-widest mb-0.5 leading-none">{label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="font-black text-3xl text-ink tracking-tighter leading-none">{value}</p>
                  <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">{unit}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_340px] gap-6 items-start">

        {/* LEFT */}
        <div className="flex flex-col gap-6">

          {/* Activity */}
          <div className="bg-surface border border-border rounded-[40px] shadow-card p-8">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black text-lg text-ink leading-none">Aktivitas Terkini</h3>
                <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mt-2">Log Sistem Terbaru</p>
              </div>
              <button className="px-4 py-2 bg-cream text-ink-3 text-[10px] font-black rounded-xl hover:bg-border transition-colors uppercase tracking-widest">Detail</button>
            </div>

            <div className="flex flex-col gap-4">
              {recentActivity.map((a, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-3xl hover:bg-cream/50 transition-colors ${
                    i !== recentActivity.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-indigo/5 border border-indigo/10 flex items-center justify-center shrink-0">
                    <Activity size={18} className="text-indigo"/>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-black text-ink">{a.user}</span>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[11px] font-bold text-ink-3 leading-none italic">{a.time}</span>
                    </div>
                    <p className="text-[12px] font-bold text-indigo uppercase tracking-wide">
                      {a.action} <span className="text-ink-3 font-medium lowercase">pada</span> {a.target}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-6">
            
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-[32px] p-7 group hover:bg-emerald-50 transition-colors">
              <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest mb-4">Network Status</p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/20"/>
                <p className="text-xl font-black text-emerald-950 tracking-tighter">Stabil (99.9%)</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-200 rounded-[32px] p-7 group hover:bg-indigo-50 transition-colors">
              <p className="text-[10px] text-indigo-700 font-black uppercase tracking-widest mb-4">Storage Used</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-black text-indigo-950 tracking-tighter">24.5 GB</p>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">/ 100 GB</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-[40px] shadow-card p-8">
            <h3 className="font-black text-lg text-ink leading-none mb-2">Pintasan Cepat</h3>
            <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-6">Akses Mudah Data</p>

            <div className="flex flex-col gap-3">
              {[
                { label:"Tambah Siswa", href:"/dashboard/admin/siswa", icon:UserPlus, color:"#6366F1", bg:"bg-indigo-100" },
                { label:"Data Pengampu", href:"/dashboard/admin/pengampu", icon:Briefcase, color:"#10B981", bg:"bg-emerald-100" },
                { label:"Kelola Kelas", href:"/dashboard/admin/kelas", icon:School, color:"#F59E0B", bg:"bg-amber-100" },
                { label:"Daftar Mapel", href:"/dashboard/admin/mapel", icon:BookMarked, color:"#EC4899", bg:"bg-pink-100" },
              ].map(a => (
                <Link key={a.label} href={a.href} className="group">
                  <div className={`flex items-center gap-4 px-5 py-4 rounded-3xl ${a.bg} border border-transparent hover:border-white group-hover:scale-[1.02] transition-all`}>
                    
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <a.icon size={18} style={{ color: a.color }} strokeWidth={2.5}/>
                    </div>

                    <p className="text-[13px] font-black flex-1" style={{ color: a.color }}>
                      {a.label}
                    </p>

                    <ChevronRight size={14} style={{ color: a.color }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Backup Warning */}
          <div className="bg-amber-100/50 border border-amber-200 rounded-[32px] p-7">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                <FileText size={22} className="text-white"/>
              </div>

              <div>
                <p className="text-[13px] font-black text-amber-900 leading-none">Auto-Backup</p>
                <p className="text-[11px] text-amber-800/70 mt-2 font-medium leading-relaxed">
                  Backup sistem aktif. Terakhir dicadangkan <span className="font-bold">3 jam yang lalu</span>.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>


    </div>
  );
}

// Dummy icon for Pengampu shortcut
function Briefcase(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}