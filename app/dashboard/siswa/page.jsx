"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  ChevronRight, 
  ClipboardList, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { getStudentDashboardDataAction } from "@/lib/actions/siswa-actions";

export default function SiswaPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ schedules: [], tugas: [], materi: [], absensiSummary: null });
  const [loading, setLoading] = useState(true);

  const todayName = useMemo(() => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const d = new Date();
    const wib = new Date(d.getTime() + (7 * 60 * 60 * 1000));
    return days[wib.getUTCDay()];
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (user?.studentId && user?.kelasId) {
        const res = await getStudentDashboardDataAction(user.studentId, user.kelasId);
        if (res.success) {
          setData(res.data);
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const jadwalHariIni = useMemo(() => {
    return data.schedules.filter(j => j.hari === todayName);
  }, [data.schedules, todayName]);

  const stats = [
    { 
      icon: ClipboardList, 
      label: "Tugas Aktif", 
      value: loading ? "..." : data.tugas.length, 
      color: "#6366F1", bg: "bg-indigo-100", 
      href: "/dashboard/siswa/tugas" 
    },
    { 
       icon: UserCheck, 
       label: "Kehadiran", 
       value: loading ? "..." : (data.absensiSummary?.percentage || 0) + "%", 
       color: "#16A34A", bg: "bg-green-100", 
       href: "/dashboard/siswa/absensi" 
    },
    { 
       icon: BookOpen, 
       label: "Materi Baru", 
       value: loading ? "..." : data.materi.length, 
       color: "#0EA5A0", bg: "bg-teal-100", 
       href: "/dashboard/siswa/materi" 
    },
  ];

  if (loading && !data.schedules.length) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
         <Loader2 className="w-10 h-10 animate-spin text-indigo" />
         <p className="text-[11px] font-black uppercase tracking-widest text-ink-3">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      
      {/* Banner / Hero */}
      <div className="group relative flex items-center justify-between min-h-[160px] rounded-[32px] px-10 py-8 bg-indigo border border-indigo-border overflow-hidden shadow-2xl shadow-indigo/20">
        
        <div className="absolute w-64 h-64 rounded-full bg-white/10 -right-20 -top-20 blur-3xl animate-pulse" />
        <div className="absolute w-40 h-40 rounded-full bg-indigo-light/20 right-40 -bottom-10 blur-2xl animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit backdrop-blur-md border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/90">Siswa Aktif</p>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none mt-2">
            Halo, {user?.name?.split(' ')[0] || "Siswa"}! 👋
          </h1>
          <p className="text-[13px] text-white/70 font-medium tracking-wide uppercase">
            {user?.kelas || "Kelas Anda"} · Portal Akademik
          </p>
        </div>

        <div className="relative z-10 text-right hidden md:block">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">E-Learning Dashboard</p>
          <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 mt-3 inline-block">
            <p className="text-[14px] font-black text-white/90 uppercase tracking-widest leading-none">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ icon: Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href}>
            <div className="group bg-surface border border-border rounded-[28px] p-6 flex items-center justify-between hover:border-indigo transition-all cursor-pointer shadow-card hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <Icon size={24} style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-black text-ink leading-none">{value}</p>
                  <p className="text-[11px] font-bold text-ink-3 uppercase tracking-widest mt-2">{label}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-3 group-hover:bg-indigo group-hover:text-white transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        
        {/* Today's Schedule Card */}
        <div className="bg-surface border border-border rounded-[32px] shadow-card overflow-hidden">
          <div className="px-8 py-6 border-b border-border bg-cream/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo text-white flex items-center justify-center shadow-lg shadow-indigo/20">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="text-[13px] font-black text-ink uppercase tracking-wider leading-none">Jadwal Hari Ini</h3>
                <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mt-1.5">{todayName}, {new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long' })}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col gap-4">
              {jadwalHariIni.length > 0 ? (
                jadwalHariIni.map((j, i) => (
                  <div key={i} className="group flex items-center gap-6 p-5 rounded-3xl border border-border bg-white hover:border-indigo/30 transition-all">
                    <div className="w-1.5 h-12 rounded-full bg-indigo/30" />
                    
                    <div className="w-32 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-ink-3">
                        <Clock size={12} />
                        <span className="text-[11px] font-black uppercase tracking-tighter">{j.jamMulai}</span>
                      </div>
                      <span className="text-[9px] font-bold text-indigo uppercase tracking-widest">{j.jamSelesai} Selesai</span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-[15px] font-black text-ink uppercase tracking-tight mb-1">{j.mapel.nama}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[11px] font-bold text-ink-3 uppercase tracking-wide truncate max-w-[150px]">
                           {j.teacher?.user?.name || "Guru"}
                        </p>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo">
                          <MapPin size={10} />
                          {j.kelas.nama}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-4 bg-cream/10 rounded-3xl border border-dashed border-border/60">
                   <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-ink-3/40">
                      <Calendar size={32} />
                   </div>
                   <div>
                      <p className="text-[13px] font-black text-ink uppercase">Libur / Tidak Ada Jadwal</p>
                      <p className="text-[11px] font-bold text-ink-3 uppercase tracking-widest mt-1">Gunakan waktu untuk istirahat atau belajar mandiri</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
            {/* Materi Terbaru Card */}
            <div className="bg-surface border border-border rounded-[32px] shadow-card p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[13px] font-black text-ink uppercase tracking-widest">Materi Terbaru</h3>
                    <Link href="/dashboard/siswa/materi">
                        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-3 hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer">
                            <ArrowUpRight size={16} />
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {data.materi.length > 0 ? (
                        data.materi.map((m, i) => (
                            <Link key={i} href="/dashboard/siswa/materi">
                                <div className="p-4 rounded-2xl border border-border bg-white hover:border-teal-400/30 transition-all flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                        <BookOpen size={18} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[13px] font-black text-ink truncate leading-tight uppercase">{m.judul}</p>
                                        <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mt-1">{m.mapel.nama}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-[11px] font-medium text-ink-3 text-center py-6 italic uppercase tracking-widest">Belum ada materi</p>
                    )}
                </div>
            </div>

            {/* Tugas Mendatang Card */}
            <div className="bg-surface border border-border rounded-[32px] shadow-card p-8">
                <div className="flex justify-between items-center mb-6">
                <h3 className="text-[13px] font-black text-ink uppercase tracking-widest">Tugas Mendatang</h3>
                <Link href="/dashboard/siswa/tugas">
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-ink-3 hover:bg-indigo/10 hover:text-indigo transition-colors cursor-pointer">
                        <ArrowUpRight size={16} />
                    </div>
                </Link>
                </div>

                <div className="flex flex-col gap-4">
                {data.tugas.length > 0 ? (
                    data.tugas.slice(0, 3).map((t, i) => (
                    <Link key={i} href="/dashboard/siswa/tugas">
                        <div className="p-5 rounded-[24px] border border-border bg-white hover:border-indigo/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[13px] font-black text-ink tracking-tight uppercase leading-none">{t.judul}</p>
                            </div>
                            <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-4 opacity-70">{t.mapel.nama}</p>
                            <div className="flex items-center gap-2 py-2 px-3 bg-cream/30 border border-border/40 rounded-xl">
                                <Clock size={12} className="text-ink-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-ink-2">
                                Deadline: {new Date(t.dueDate).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </Link>
                    ))
                ) : (
                    <p className="text-[11px] font-medium text-ink-3 text-center py-8 italic uppercase tracking-widest">Tidak ada tugas terbaru</p>
                )}
                </div>
            </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
