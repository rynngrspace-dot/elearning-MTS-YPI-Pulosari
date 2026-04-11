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

      {/* TABLE SECTION */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-border">
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em] w-16">No</th>
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em] w-32">Hari</th>
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em]">Mata Pelajaran</th>
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em] text-center">Kelas</th>
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em] text-center">Waktu</th>
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em] text-center">Siswa</th>
                <th className="px-6 py-4 text-[11px] font-bold text-ink-3 uppercase tracking-[0.15em] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedSchedule.length > 0 ? sortedSchedule.map((item, idx) => (
                <tr key={idx} className="group hover:bg-indigo-light/20 transition-colors">
                  <td className="px-6 py-4 text-[12px] tabular-nums font-bold text-ink-3 opacity-40">
                    {(idx + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      item.hari === "Senin" ? "bg-red-50 text-red-600" :
                      item.hari === "Selasa" ? "bg-amber-50 text-amber-600" :
                      item.hari === "Rabu" ? "bg-green-50 text-green-600" :
                      item.hari === "Kamis" ? "bg-blue-50 text-blue-600" :
                      item.hari === "Jumat" ? "bg-indigo-light text-indigo" :
                      "bg-zinc-100 text-zinc-600"
                    )}>
                      {item.hari}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-[14px] font-bold text-ink tracking-tight uppercase group-hover:text-indigo transition-colors">{item.mapel}</p>
                      <p className="text-[10px] text-ink-3 font-medium opacity-60">Sesi Belajar Aktif</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-zinc-100 border border-border rounded-xl text-[12px] font-black text-ink-2 group-hover:bg-indigo group-hover:text-white transition-all shadow-sm">
                      {item.kelas}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={14} className="text-ink-3 opacity-30" />
                      <span className="text-[13px] font-bold text-ink tabular-nums">
                        {item.jamMulai} - {item.jamSelesai}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users size={14} className="text-ink-3 opacity-30" />
                      <span className="text-[12px] font-bold text-ink-2 underline decoration-indigo/20 underline-offset-4">{item.siswa}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-100/50" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20 grayscale">
                      <CalendarClock size={48} className="mb-4" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada jadwal mengajar yang terpetakan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
