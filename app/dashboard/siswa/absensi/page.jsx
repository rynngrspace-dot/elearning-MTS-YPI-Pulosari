"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  CalendarDays,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/lib/AuthContext";
import { getStudentAttendanceAction } from "@/lib/actions/absensi-actions";

// Status Configuration - Mapped to DB values
const statusCfg = {
  "hadir": { label: "H", c: "#16A34A", bg: "bg-green-100", border: "border-green-200" },
  "sakit": { label: "S", c: "#D97706", bg: "bg-amber-100", border: "border-amber-200" },
  "izin": { label: "I", c: "#6366F1", bg: "bg-indigo-100", border: "border-indigo-200" },
  "alpha": { label: "A", c: "#DC2626", bg: "bg-red-100", border: "border-red-200" },
  "terlambat": { label: "T", c: "#EA580C", bg: "bg-orange-100", border: "border-orange-200" },
};

const BULAN_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function PresensiPage() {
  const { user } = useAuth();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      if (user?.id) {
        const res = await getStudentAttendanceAction(user.id, currentMonth, currentYear);
        if (res.success) {
          // Transform raw DB records into grid format: { SubjectName: { Day: Status } }
          const grouped = {};
          res.data.forEach(item => {
            const subject = item.mapel.nama;

            // AMBIL ANGKA TANGGAL LANGSUNG DARI UTC
            // Karena kita simpan di jam 12:00 UTC (UTC Noon), 
            // getUTCDate() pasti mengembalikan angka tanggal yang benar tanpa shift.
            const day = new Date(item.tanggal).getUTCDate();

            if (!grouped[subject]) grouped[subject] = {};
            grouped[subject][day] = item.status;
          });
          setRecords(grouped);
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchAttendance();
    }
  }, [user, currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const attendanceRate = useMemo(() => {
    if (Object.keys(records).length === 0) return 0;
    let total = 0;
    let present = 0;
    Object.values(records).forEach(subj => {
      Object.values(subj).forEach(status => {
        total++;
        if (status === "Hadir" || status === "Terlambat") present++;
      });
    });
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }, [records]);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 animate-[slideUp_0.4s_ease_both]">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo flex items-center justify-center text-white shadow-lg shadow-indigo/20">
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-ink uppercase tracking-tight leading-none">Rekap Presensi Bulanan</h1>
            <p className="text-[11px] font-bold text-ink-3 uppercase tracking-widest mt-2 opacity-60">Pantau kehadiran Anda berdasarkan rekaman Guru</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white border border-border px-5 py-3 rounded-2xl shadow-sm">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-ink-3 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-[140px] text-center">
            <p className="text-[13px] font-black text-ink uppercase tracking-wider">{BULAN_ID[currentMonth]}</p>
            <p className="text-[10px] font-black text-ink-3 uppercase tracking-[0.2em]">{currentYear}</p>
          </div>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center text-ink-3 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="w-full h-80 flex flex-col items-center justify-center gap-4">
              <Loader2 size={32} className="animate-spin text-indigo" />
              <p className="text-[11px] font-black uppercase tracking-widest text-ink-3">Mengambil histori...</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cream/40 border-b border-border">
                  <th className="sticky left-0 z-20 bg-cream/80 backdrop-blur-md px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-ink-3 w-[220px] border-r border-border min-w-[220px]">
                    Mata Pelajaran
                  </th>
                  {daysArray.map(day => (
                    <th key={day} className="px-3 py-5 text-center text-[10px] font-black uppercase tracking-widest text-ink-3 border-r border-border/50 min-w-[42px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {Object.keys(records).length > 0 ? (
                  Object.entries(records).map(([subject, attendance]) => (
                    <tr key={subject} className="hover:bg-cream/10 transition-colors group">
                      <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-r border-border shadow-[4px_0_10px_-2px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo/30" />
                          <span className="text-[12px] font-black text-ink uppercase tracking-tight">{subject}</span>
                        </div>
                      </td>
                      {daysArray.map(day => {
                        const status = attendance[day];
                        const cfg = status ? statusCfg[status] : null;

                        return (
                          <td key={day} className="p-1.5 border-r border-border/30 text-center">
                            {cfg ? (
                              <div
                                title={`${subject} - Tgl ${day}: ${status}`}
                                className={cn(
                                  "w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-[11px] font-black transition-transform hover:scale-110",
                                  cfg.bg,
                                  cfg.border,
                                  "border"
                                )}
                                style={{ color: cfg.c }}
                              >
                                {cfg.label}
                              </div>
                            ) : (
                              <div className="w-8 h-8 mx-auto rounded-lg border border-dashed border-border/40" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={daysInMonth + 1} className="py-20 text-center">
                      <p className="text-[13px] font-medium text-ink-3 italic uppercase tracking-widest">
                        Tidak ada data presensi untuk bulan ini
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="bg-surface border border-border rounded-[32px] p-8 shadow-card flex flex-wrap gap-8 items-center">
          <h4 className="text-[11px] font-black text-ink-3 uppercase tracking-[0.2em] w-full mb-2">Keterangan:</h4>
          {Object.entries(statusCfg).map(([full, cfg]) => (
            <div key={cfg.label} className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black border", cfg.bg, cfg.border)} style={{ color: cfg.c }}>
                {cfg.label}
              </div>
              <span className="text-[12px] font-bold text-ink uppercase tracking-wider">{cfg.label} = {full}</span>
            </div>
          ))}
        </div>

        <div className="bg-indigo border border-indigo-border rounded-[32px] p-8 flex items-center gap-6 shadow-xl shadow-indigo/20">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
            <FileText size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Status Kehadiran</p>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              {attendanceRate >= 90 ? "Sangat Baik" : attendanceRate >= 75 ? "Cukup Baik" : "Perlu Perhatian"}
            </h3>
            <p className="text-[12px] font-medium text-white/70 mt-1">Estimasi persentase kehadiran Anda: {attendanceRate}%</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
