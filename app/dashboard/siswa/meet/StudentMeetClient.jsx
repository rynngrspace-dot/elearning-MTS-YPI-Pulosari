"use client";

import { useState, useEffect } from "react";
import { Video, ExternalLink, CalendarClock, User, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { getMeetingsForStudentAction } from "@/lib/actions/meet-actions";

export default function StudentMeetClient({ initialMeetings, kelasId, userName }) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    const res = await getMeetingsForStudentAction(kelasId);
    if (res.success) {
      setMeetings(res.data);
    }
    setRefreshing(false);
  };

  // Poll for meetings every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 flex flex-col gap-8 animate-[slideUp_.3s_ease]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo flex items-center justify-center text-white shadow-lg border border-indigo-border">
            <Video size={24} />
          </div>
          <div>
             <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-indigo-light text-indigo text-[10px] font-black uppercase tracking-widest rounded">Virtual Classroom</span>
                <div className="h-1 w-1 rounded-full bg-border" />
                <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest leading-none">Join Meeting</p>
             </div>
             <h1 className="text-2xl font-bold text-ink tracking-tight uppercase">Ruang Tatap Muka</h1>
          </div>
        </div>

        <button 
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-[10px] font-bold text-ink-2 uppercase tracking-widest hover:bg-zinc-50 transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          {refreshing ? <Loader2 size={12} className="animate-spin" /> : <CalendarClock size={12} />}
          Refresh Jadwal
        </button>
      </div>

      {/* MEETINGS LIST */}
      <div className="flex flex-col gap-6">
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meet) => (
              <div key={meet.id} className="bg-white border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-6 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 bg-green-500/5 rounded-full" />
                
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em]">Sesi Sedang Berlangsung</span>
                   </div>
                </div>

                {/* Info */}
                <div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-indigo uppercase tracking-widest mb-1 opacity-80">
                      <BookOpen size={12} /> {meet.pengampu.mapel.nama}
                   </div>
                   <h3 className="text-lg font-bold text-ink tracking-tight uppercase leading-tight mb-4 group-hover:text-indigo transition-colors line-clamp-2">
                     Kelas Virtual Bersama Guru
                   </h3>
                   
                   <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-ink-2 shadow-sm">
                         <User size={18} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                         <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">Pengajar</p>
                         <p className="text-sm font-bold text-ink truncate">{meet.pengampu.teacher.user.name}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <button
                     onClick={() => {
                       const encodedName = encodeURIComponent(userName || "Siswa");
                       const jitsiUrl = `https://meet.jit.si/${meet.roomName}#config.prejoinPageEnabled=false&userInfo.displayName="${encodedName}"`;
                       window.open(jitsiUrl, "_blank");
                     }}
                     className="w-full py-4 bg-indigo text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-dark transition shadow-lg shadow-indigo/10 cursor-pointer"
                   >
                     <ExternalLink size={16} /> Gabung Pertemuan
                   </button>
                   <p className="text-[9px] text-center text-ink-3 font-bold uppercase tracking-widest mt-3 opacity-40 italic">
                     *Meeting dibuka sejak {new Date(meet.startedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                   </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-dashed border-border py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-6 shadow-inner ring-8 ring-zinc-50/50">
               <Video size={40} />
            </div>
            <h3 className="text-lg font-bold text-ink tracking-tight uppercase mb-2">Tidak Ada Pertemuan Aktif</h3>
            <p className="text-xs text-ink-3 font-medium max-w-sm leading-relaxed opacity-60">
              Saat ini belum ada kelas virtual yang sedang berlangsung untuk kelas Anda. Mohon tunggu instruksi lebih lanjut dari Guru mata pelajaran.
            </p>
            
            <div className="mt-10 flex items-center gap-2 px-4 py-2 bg-indigo/5 text-indigo text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo/10">
               <AlertCircle size={14} /> Otomatis Me-refresh setiap 30 detik
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
