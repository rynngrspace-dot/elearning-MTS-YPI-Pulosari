"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, 
  ClipboardList, 
  Video, 
  ChevronLeft,
  User,
  School,
  CalendarClock
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/lib/AuthContext";
import { getSubjectDetailAction } from "@/lib/actions/pengampu-actions";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Prioritaskan kelasId dari session user
      const kelasId = user?.kelasId;
      const mapelId = params.id;

      if (kelasId && mapelId) {
        const res = await getSubjectDetailAction(kelasId, mapelId);
        if (res.success && res.data) {
          setData({
            name: res.data.mapel.nama,
            teacher: res.data.teacher?.user?.name || "Guru Belum Ditentukan",
            kelas: res.data.kelas?.nama || "---",
            jadwal: res.data.hari ? `${res.data.hari}, ${res.data.jamMulai} - ${res.data.jamSelesai}` : "Jadwal Belum Diatur"
          });
        } else {
          // Fallback jika tidak ada record pengampu (misal di DB belum disetting admin)
          setData({
            name: params.id.toUpperCase().replace(/-/g, ' '), 
            teacher: "Guru Pengampu", 
            kelas: user?.kelas || "---", 
            jadwal: "Jadwal Belum Diatur" 
          });
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [params.id, user]);

  const menuCards = [
    { title: "Materi", icon: FileText, href: `/dashboard/siswa/materi?id=${params.id}` },
    { title: "Tugas", icon: ClipboardList, href: `/dashboard/siswa/tugas?id=${params.id}` },
    { title: "Jitsi Meet", icon: Video, href: `/dashboard/siswa/meet/` },
  ];

  if (loading) return (
    <div className="p-12 flex items-center justify-center min-h-[400px]">
       <div className="w-10 h-10 border-4 border-indigo/20 border-t-indigo rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 animate-[fadeIn_0.4s_ease-out]">
      
      {/* Header Section - DYNAMIC */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-ink-3 hover:text-indigo transition-colors"
        >
          <ChevronLeft size={14} /> Kembali
        </button>

        <div className="bg-surface border border-border rounded-[32px] overflow-hidden shadow-card">
           <div className="px-8 py-5 border-b border-border bg-cream/10">
              <h1 className="text-xl font-black text-ink uppercase tracking-tight">
                {data?.name || "Mata Pelajaran"}
              </h1>
           </div>
           
           <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo border border-indigo/10 shadow-inner">
                    <School size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Unit Kelas</p>
                    <p className="text-[15px] font-black text-ink">{data?.kelas}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo border border-indigo/10 shadow-inner">
                    <User size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Guru Pengampu</p>
                    <p className="text-[15px] font-black text-ink truncate max-w-[200px]">{data?.teacher}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 md:justify-end">
                 <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Jadwal Aktif</p>
                    <p className="text-[14px] font-black text-indigo uppercase">{data?.jadwal}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo border border-indigo/10 shadow-inner">
                    <CalendarClock size={20} />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Grid Menu Cards - DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {menuCards.map((card, idx) => (
          <Link key={idx} href={card.href} className="group">
             <div className="bg-white border border-border rounded-[32px] flex flex-col items-center justify-center py-10 px-6 gap-6 transition-all hover:shadow-xl hover:-translate-y-1.5 group-hover:border-indigo duration-300 shadow-card">
                <div className="w-16 h-16 rounded-2xl bg-cream group-hover:bg-indigo-light/20 flex items-center justify-center text-ink-3 group-hover:text-indigo transition-all duration-500 ring-0 group-hover:ring-4 ring-indigo/5">
                   <card.icon size={32} strokeWidth={2} />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                   <h3 className="text-lg font-black text-ink uppercase tracking-tight">{card.title}</h3>
                   <div className="w-8 h-0.5 bg-indigo rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </div>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-2 text-ink-3/40 mt-4">
         <div className="w-8 h-px bg-border" />
         <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Portal Akademik El-Hidayah</span>
         <div className="w-8 h-px bg-border" />
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
