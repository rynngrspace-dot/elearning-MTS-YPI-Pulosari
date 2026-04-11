"use client";

import { CalendarClock, Clock, School, Users, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const dayOrder = { "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6, "Minggu": 7 };

export default function GuruJadwalClient({ initialSchedule }) {
  // Sort schedule chronologically by day and then time
  const sortedSchedule = [...initialSchedule].sort((a, b) => {
    if (dayOrder[a.hari] !== dayOrder[b.hari]) {
      return dayOrder[a.hari] - dayOrder[b.hari];
    }
    return (a.jamMulai || "").localeCompare(b.jamMulai || "");
  });

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
              <span className="px-2.5 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-[0.2em]">Sistem Akademik</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest leading-none">Weekly Schedule</p>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight uppercase leading-none">Jadwal Mengajar Anda</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-border rounded-xl shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-ink-2">{sortedSchedule.length} Sesi Terjadwal</span>
          </div>
        </div>
      </div>

      {/* SCHEDULE LIST GROUPED BY DAY */}
      <div className="flex flex-col gap-10">
        {Object.keys(dayOrder).map((dayName) => {
          const sessionsForDay = sortedSchedule.filter(s => s.hari === dayName);
          if (sessionsForDay.length === 0) return null;

          return (
            <div key={dayName} className="flex flex-col gap-4">
              {/* Day Label Separator */}
              <div className="flex items-center gap-4 px-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                <h2 className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border shadow-sm transition-all",
                  dayName === "Senin" ? "bg-red-50 text-red-600 border-red-100" :
                  dayName === "Selasa" ? "bg-amber-50 text-amber-600 border-amber-100" :
                  dayName === "Rabu" ? "bg-green-50 text-green-600 border-green-100" :
                  dayName === "Kamis" ? "bg-blue-50 text-blue-600 border-blue-100" :
                  dayName === "Jumat" ? "bg-indigo-light text-indigo border-indigo/10" :
                  "bg-zinc-50 text-zinc-600 border-zinc-200"
                )}>
                  HARI {dayName}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent opacity-50" />
              </div>

              {/* Day Sessions List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionsForDay.map((item, idx) => (
                  <div key={idx} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo/20 transition-all group overflow-hidden relative">
                    {/* Time Badge - Top Right */}
                    <div className="absolute top-0 right-0 px-3 py-1 bg-zinc-50 border-bl border-border rounded-bl-xl text-[9px] font-bold text-ink-3 tabular-nums group-hover:bg-indigo group-hover:text-white transition-colors">
                      {item.jamMulai} - {item.jamSelesai}
                    </div>

                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-light flex items-center justify-center text-indigo shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Clock size={18} />
                      </div>
                      <div className="flex flex-col gap-1 pr-12">
                        <h4 className="text-[14px] font-bold text-ink uppercase tracking-tight group-hover:text-indigo transition-colors line-clamp-1">
                          {item.mapel}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-60">
                           <School size={12} className="text-indigo/60" /> Kelas {item.kelas}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-70">
                        <Users size={12} className="text-indigo/40" /> {item.siswa} SISWA
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {sortedSchedule.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-20 grayscale border-2 border-dashed border-border rounded-3xl">
            <CalendarClock size={48} className="mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada jadwal mengajar yang terdaftar</p>
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
