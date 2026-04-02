"use client";

import { CalendarClock, Clock, School, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function GuruJadwalClient({ initialSchedule }) {
  // Use today's day as default if possible, otherwise Monday
  const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());
  const defaultDay = DAYS.includes(today) ? today : "Senin";
  
  const [activeDay, setActiveDay] = useState(defaultDay);

  // Group schedule by day for the main view
  const groupedSchedule = initialSchedule.reduce((acc, item) => {
    if (!acc[item.hari]) acc[item.hari] = [];
    acc[item.hari].push(item);
    return acc;
  }, {});

  // Sort items by start time
  Object.keys(groupedSchedule).forEach(day => {
    groupedSchedule[day].sort((a, b) => (a.jamMulai || "").localeCompare(b.jamMulai || ""));
  });

  const activeItems = groupedSchedule[activeDay] || [];

  return (
    <div className="p-8 flex flex-col gap-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-md">
            <CalendarClock size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="px-2.5 py-1 bg-indigo-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-[0.2em]">Pusat Akademik</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[9px] text-ink-3 font-bold uppercase tracking-widest leading-none">Time Management</p>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight uppercase leading-none">Jadwal Mengajar</h1>
          </div>
        </div>
      </div>

      {/* DAY NAVIGATION */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative group">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
               <h3 className="text-lg font-bold text-ink uppercase tracking-tight leading-none mb-1.5">Pilih Hari</h3>
               <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-60">Klik untuk melihat jadwal harian</p>
            </div>

            <div className="flex flex-wrap gap-2">
               {DAYS.map((d) => (
                 <button 
                   key={d} 
                   onClick={() => setActiveDay(d)}
                   className={cn(
                     "px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border",
                     activeDay === d 
                       ? "bg-indigo text-white border-indigo shadow-md shadow-indigo/10" 
                       : "bg-cream text-ink-3 hover:bg-indigo-light hover:text-indigo border-border/50"
                   )}
                 >
                   {d}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* SCHEDULE VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeItems.length > 0 ? activeItems.map((item, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo/20 transition-all group relative overflow-hidden">
             <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-light flex items-center justify-center text-indigo shadow-inner group-hover:bg-indigo group-hover:text-white transition-all">
                   <Clock size={18} strokeWidth={2.5} />
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-bold text-ink-3 uppercase tracking-[0.2em] mb-1">Waktu Sesi</p>
                   <span className="text-[11px] font-bold text-ink uppercase tabular-nums">
                     {item.jamMulai} - {item.jamSelesai}
                   </span>
                </div>
             </div>

             <div className="mb-6">
                <h5 className="text-[15px] font-bold text-ink uppercase tracking-tight mb-1">{item.mapel}</h5>
                <div className="flex items-center gap-2 text-[9px] font-bold text-ink-3 uppercase tracking-widest">
                   <School size={12} className="text-indigo/60" /> Kelas {item.kelas}
                </div>
             </div>

             <div className="pt-5 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-70">
                   <Users size={12} className="text-indigo/60" /> {item.siswa} Siswa Terdaftar
                </div>
                <div className="w-2 h-2 rounded-full bg-indigo animate-pulse" title="Sesi Sesuai Jadwal" />
             </div>
          </div>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale lowercase border-2 border-dashed border-border rounded-2xl">
             <CalendarClock size={48} className="mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Tidak ada jadwal mengajar pada hari {activeDay}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
