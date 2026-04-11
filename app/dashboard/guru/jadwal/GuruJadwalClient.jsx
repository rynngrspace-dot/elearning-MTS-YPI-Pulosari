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
      <div className="flex flex-col gap-14">
        {Object.keys(dayOrder).map((dayName) => {
          const sessionsForDay = sortedSchedule.filter(s => s.hari === dayName);
          if (sessionsForDay.length === 0) return null;

          return (
            <div key={dayName} className="flex flex-col md:flex-row gap-6 md:gap-12 group/day">
              {/* Day Label Area */}
              <div className="md:w-32 shrink-0">
                <div className="sticky top-24">
                  <h2 className="text-[12px] font-black text-indigo uppercase tracking-[0.3em] mb-1">
                    {dayName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-indigo rounded-full opacity-20 group-hover/day:w-12 group-hover/day:opacity-100 transition-all duration-500" />
                    <span className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-40">Day {dayOrder[dayName]}</span>
                  </div>
                </div>
              </div>

              {/* Day Sessions List */}
              <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 relative">
                {/* Vertical Connector Line */}
                <div className="absolute -left-6 md:-left-9 top-2 bottom-2 w-px bg-gradient-to-b from-border/50 via-border to-border/50 hidden md:block" />

                {sessionsForDay.map((item, idx) => (
                  <div key={idx} className="bg-white border border-border/80 rounded-[24px] p-6 hover:border-indigo/40 transition-all duration-300 group/card relative flex flex-col gap-5">
                    {/* Time & Counter */}
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover/card:bg-indigo group-hover/card:text-white transition-all shadow-inner">
                            <Clock size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest opacity-60">Sesi {idx + 1}</p>
                            <p className="text-[13px] font-bold text-ink tabular-nums">{item.jamMulai} — {item.jamSelesai}</p>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-widest group-hover/card:bg-indigo/5 group-hover/card:text-indigo group-hover/card:border-indigo/10 transition-colors">
                         Scheduled
                       </div>
                    </div>

                    {/* Main Content */}
                    <div className="pl-1">
                      <h4 className="text-[16px] font-extrabold text-ink uppercase tracking-tight mb-2 group-hover/card:text-indigo transition-colors leading-tight">
                        {item.mapel}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                         <div className="px-3 py-1.5 bg-indigo-light/30 border border-indigo/10 rounded-xl flex items-center gap-2 text-[10px] font-bold text-indigo">
                            <School size={12} className="opacity-60" /> Kelas {item.kelas}
                         </div>
                         <div className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center gap-2 text-[10px] font-bold text-ink-3">
                            <Users size={12} className="opacity-60" /> {item.siswa} Siswa
                         </div>
                      </div>
                    </div>

                    {/* Footer decoration */}
                    <div className="h-1 w-0 group-hover/card:w-full bg-gradient-to-r from-indigo via-indigo/60 to-transparent absolute bottom-0 left-0 transition-all duration-500 opacity-20" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {sortedSchedule.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-[40px] bg-zinc-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-zinc-200 shadow-sm border border-zinc-100 mb-4">
              <CalendarClock size={32} />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-1">Jadwal Kosong</h3>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Belum ada sesi mengajar yang terdaftar di sistem</p>
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
