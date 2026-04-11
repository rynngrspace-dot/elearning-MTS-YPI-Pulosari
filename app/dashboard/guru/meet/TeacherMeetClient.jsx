"use client";

import { useState } from "react";
import { Video, Plus, ExternalLink, Power, Users, School, Loader2, CalendarClock } from "lucide-react";
import { createMeetingAction, endMeetingAction } from "@/lib/actions/meet-actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TeacherMeetClient({ initialAssignments, teacherId, userName }) {
  const [loading, setLoading] = useState({});
  const [assignments, setAssignments] = useState(initialAssignments);

  const handleStartMeeting = async (asg) => {
    const id = asg.id;
    setLoading(p => ({ ...p, [id]: true }));

    // Generate room name: elearningjamil-[mapel]-[kelas]-[timestamp]
    const cleanMapel = asg.mapel.nama.replace(/\s+/g, '-').toLowerCase();
    const cleanKelas = asg.kelas.nama.replace(/\s+/g, '-').toLowerCase();
    const roomName = `elearningjamil-${cleanMapel}-${cleanKelas}-${Date.now()}`;

    const res = await createMeetingAction(asg.id, roomName);
    
    if (res.success) {
      toast({
        title: "Pertemuan Dimulai",
        description: `Room untuk ${asg.mapel.nama} - ${asg.kelas.nama} telah aktif.`,
        variant: "success",
      });
      
      // Update local state
      setAssignments(prev => prev.map(a => 
        a.id === id ? { ...a, meetings: [res.data] } : a
      ));

      // Open Jitsi In New Tab with Auto-Login Params
      const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName="${userName || "Guru"}"`;
      window.open(jitsiUrl, "_blank");
    } else {
      toast({
        title: "Gagal",
        description: res.error,
        variant: "destructive",
      });
    }
    setLoading(p => ({ ...p, [id]: false }));
  };

  const handleEndMeeting = async (asg) => {
    const meeting = asg.meetings[0];
    if (!meeting) return;

    const id = asg.id;
    setLoading(p => ({ ...p, [id]: true }));

    const res = await endMeetingAction(meeting.id);
    
    if (res.success) {
      toast({
        title: "Pertemuan Berakhir",
        description: "Status room telah diubah menjadi non-aktif.",
      });
      
      // Update local state
      setAssignments(prev => prev.map(a => 
        a.id === id ? { ...a, meetings: [] } : a
      ));
    } else {
      toast({
        title: "Gagal",
        description: res.error,
        variant: "destructive",
      });
    }
    setLoading(p => ({ ...p, [id]: false }));
  };

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
                <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest leading-none">Jitsi Meet Integration</p>
             </div>
             <h1 className="text-2xl font-bold text-ink tracking-tight">KONTROL TATAP MUKA</h1>
          </div>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-indigo-light/20 border border-indigo/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
         <div className="w-12 h-12 shrink-0 rounded-full bg-indigo/10 flex items-center justify-center text-indigo">
            <Users size={20} />
         </div>
         <div className="flex-1">
            <h4 className="text-sm font-bold text-indigo uppercase tracking-tight mb-1">Panduan Penggunaan</h4>
            <p className="text-xs text-ink-2 leading-relaxed max-w-2xl">
              Klik <strong>"Mulai Pertemuan"</strong> untuk membuka ruang virtual bagi siswa. Link akan otomatis muncul di dashboard siswa yang bersangkutan. 
              Gunakan fitur ini untuk sesi tanya jawab atau kelas daring secara real-time. (Auto-login aktif: Nama Anda akan otomatis terpasang di Meeting).
            </p>
         </div>
      </div>

      {/* GRID KELAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.length > 0 ? assignments.map((asg) => {
          const activeMeeting = asg.meetings[0];
          const isProcessing = loading[asg.id];

          return (
            <div key={asg.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-6 relative overflow-hidden group">
               {/* Decorative Indicator */}
               <div className={cn(
                 "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-all group-hover:opacity-10 scale-150 shrink-0",
                 activeMeeting ? "bg-green-500" : "bg-indigo"
               )} />

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-border rounded-lg text-[10px] font-black text-ink-3 uppercase tracking-widest">
                     <School size={12} className="text-indigo/40" /> Kelas {asg.kelas.nama}
                  </div>
                  {activeMeeting && (
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Aktif</span>
                    </div>
                  )}
               </div>

               <div>
                  <h3 className="text-lg font-bold text-ink uppercase tracking-tight mb-1 group-hover:text-indigo transition-colors">{asg.mapel.nama}</h3>
                  <p className="text-[10px] text-ink-3 font-bold uppercase tracking-[0.2em] opacity-60">
                    <CalendarClock size={12} className="inline mr-1 pb-0.5" />
                    {asg.hari || "Belum Terjadwal"} • {asg.jamMulai || "--:--"}
                  </p>
               </div>

               <div className="mt-auto flex flex-col gap-2">
                  {activeMeeting ? (
                    <>
                      <button
                        onClick={() => {
                          const jitsiUrl = `https://meet.jit.si/${activeMeeting.roomName}#config.prejoinPageEnabled=false&userInfo.displayName="${userName || "Guru"}"`;
                          window.open(jitsiUrl, "_blank");
                        }}
                        className="w-full py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-sm cursor-pointer"
                      >
                        <ExternalLink size={14} /> Masuk Ulang Room
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleEndMeeting(asg)}
                        className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Power size={12} />}
                        Akhiri Pertemuan
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleStartMeeting(asg)}
                      className="w-full py-4 bg-indigo text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-dark transition shadow-lg shadow-indigo/10 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Mulai Pertemuan
                    </button>
                  )}
               </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-3xl bg-zinc-50/50">
             <Video size={48} className="text-zinc-200 mb-4" />
             <p className="text-[11px] font-black text-ink-3 uppercase tracking-widest">Belum ada kelas yang diampu</p>
          </div>
        )}
      </div>
    </div>
  );
}
