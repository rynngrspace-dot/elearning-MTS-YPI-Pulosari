"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Calendar,
  School,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusCfg = {
  hadir:     { label: "Hadir", icon: CheckCircle2, c: "#16A34A", bg: "bg-green-50", border: "border-green-100" },
  sakit:     { label: "Sakit", icon: AlertCircle, c: "#D97706", bg: "bg-amber-50", border: "border-amber-100" },
  izin:      { label: "Izin", icon: Clock, c: "#6366F1", bg: "bg-indigo-50", border: "border-indigo-100" },
  alpha:     { label: "Alpha", icon: XCircle, c: "#DC2626", bg: "bg-red-50", border: "border-red-100" },
};

const BULAN_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const HARI_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const getTodayIndo = () => {
  const d = new Date();
  return `${HARI_ID[d.getDay()]}, ${d.getDate()} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`;
};

const getLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AbsensiClient({ teacherId, assignedClasses }) {
  const [selectedMapping, setSelectedMapping] = useState(assignedClasses[0] || null);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [originalStatuses, setOriginalStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [search, setSearch] = useState("");
  const [savedStatus, setSavedStatus] = useState(null); // 'success' | 'error' | null

  // Calendar State
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const fetchData = useCallback(async () => {
    if (!selectedMapping || !selectedDate) return;
    setLoading(true);
    setHasExisting(false);
    setIsEditing(false);
    try {
      const res = await fetch(`/api/absensi?kelasId=${selectedMapping.kelasId}&mapelId=${selectedMapping.mapelId}&date=${selectedDate}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStudents(data.students);
      
      const existingKeys = Object.keys(data.existing);
      const isHistory = existingKeys.length > 0;
      setHasExisting(isHistory);
      
      // If no history, allow editing immediately. If history exists, start in read-only mode.
      setIsEditing(!isHistory);

      // Merge: either existing record or default 'hadir'
      const initialStatuses = {};
      data.students.forEach(s => {
        initialStatuses[s.id] = data.existing[s.id] || "hadir";
      });
      setStatuses(initialStatuses);
      setOriginalStatuses(initialStatuses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedMapping, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancel = () => {
    setStatuses(originalStatuses);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSavedStatus(null);
    try {
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          mapelId: selectedMapping.mapelId,
          kelasId: selectedMapping.kelasId,
          date: selectedDate,
          statuses
        })
      });
      if (res.ok) {
        setSavedStatus('success');
        setHasExisting(true);
        setIsEditing(false);
        setTimeout(() => setSavedStatus(null), 3000);
      } else {
        setSavedStatus('error');
      }
    } catch (err) {
      setSavedStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = (studentId, status) => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const summary = Object.values(statuses).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const filteredStudents = students.filter(s => 
    s.user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calendar Helpers
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  return (
    <div className="p-8 flex flex-col gap-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-md">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-3 mb-1.5">
              <span className="px-2.5 py-1 bg-indigo-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-[0.2em]">Pusat Akademik</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[9px] text-ink-3 font-bold uppercase tracking-widest leading-none">Kehadiran Siswa</p>
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-200 ml-1" />
              <div className="flex items-center gap-1.5">
                <Calendar size={10} className="text-indigo-500" />
                <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest leading-none">{getTodayIndo()}</p>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight uppercase leading-none">Presensi Harian</h1>
          </div>
        </div>

        <div className="flex gap-3">
          {hasExisting && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all bg-white border border-border hover:border-indigo/50 text-ink shadow-sm"
            >
              <Save size={14} className="opacity-40" />
              Edit Absensi
            </button>
          )}

          {hasExisting && isEditing && (
            <button 
              onClick={handleCancel}
              className="px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all bg-cream text-ink-3 hover:bg-red-50 hover:text-red-600 border border-border/50"
            >
              Batal
            </button>
          )}

          {(isEditing || !hasExisting) && (
            <button 
              onClick={handleSave}
              disabled={saving || loading}
              className={cn(
                "flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95",
                savedStatus === 'success' ? "bg-green-600 text-white" : "bg-indigo text-white hover:bg-indigo-600 shadow-indigo/20"
              )}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {savedStatus === 'success' ? "Tersimpan" : saving ? "Menyimpan..." : "Simpan Absensi"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8 items-start">
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="flex flex-col gap-6">
          {/* Class Select */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
                <School size={18} className="text-indigo" />
                <h3 className="text-[13px] font-bold text-ink uppercase tracking-tight">Pilih Kelas</h3>
             </div>
             <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-40 mb-6">Status: {isEditing ? "Mode Edit" : "Mode Baca"}</p>
             <div className="flex flex-col gap-2.5">
                {assignedClasses.map(c => (
                  <button 
                    key={`${c.kelasId}-${c.mapelId}`}
                    onClick={() => setSelectedMapping(c)}
                    className={cn(
                      "flex flex-col text-left px-4 py-3 rounded-xl border transition-all",
                      selectedMapping?.id === c.id 
                        ? "bg-indigo-light border-indigo/20 text-indigo shadow-inner" 
                        : "bg-surface border-border hover:border-indigo/10"
                    )}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-tight">{c.mapelName}</span>
                    <span className="text-[9px] font-medium opacity-60 uppercase tracking-widest">Kelas {c.kelasName}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Calendar Select */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
               <button onClick={() => { setViewMonth(m => m === 0 ? (setViewYear(y => y - 1), 11) : m - 1) }} className="p-2 hover:bg-cream rounded-lg group transition-all"><ChevronLeft size={14} className="text-ink-3 group-hover:text-indigo" /></button>
               <h4 className="text-[11px] font-bold text-ink uppercase tracking-widest">{BULAN_ID[viewMonth]} {viewYear}</h4>
               <button onClick={() => { setViewMonth(m => m === 11 ? (setViewYear(y => y + 1), 0) : m + 1) }} className="p-2 hover:bg-cream rounded-lg group transition-all"><ChevronRight size={14} className="text-ink-3 group-hover:text-indigo" /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
               {DAYS_SHORT.map(d => <span key={d} className="text-[8px] font-bold text-ink-3 uppercase opacity-50">{d}</span>)}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
               {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} />)}
               {Array.from({ length: daysInMonth }).map((_, i) => {
                 const d = i + 1;
                 const fullDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                 const isSelected = selectedDate === fullDate;
                 const isFuture = new Date(fullDate) > new Date().setHours(23, 59, 59, 999);

                 return (
                   <button 
                     key={d} 
                     onClick={() => !isFuture && setSelectedDate(fullDate)}
                     disabled={isFuture}
                     className={cn(
                       "aspect-square rounded-lg text-[10px] font-bold transition-all flex items-center justify-center",
                       isSelected ? "bg-indigo text-white shadow-md shadow-indigo/20" : "hover:bg-indigo-light hover:text-indigo text-ink-3",
                       isFuture && "opacity-20 cursor-not-allowed grayscale"
                     )}
                   >
                     {d}
                   </button>
                 );
               })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: STUDENT LIST TABLE */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
           <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border-b border-border/50">
              <div className="relative flex-1 max-w-sm">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="CARI SISWA..." 
                   className="w-full pl-10 pr-5 py-3 bg-cream/30 border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all"
                 />
              </div>

              <div className="flex flex-wrap gap-2.5">
                 {Object.entries(statusCfg).map(([k, cfg]) => (
                   <div key={k} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest", cfg.bg, cfg.border)} style={{ color: cfg.c }}>
                      <cfg.icon size={11} />
                      {summary[k] || 0} {cfg.label}
                   </div>
                 ))}
              </div>
           </div>

           {loading ? (
             <div className="py-20 flex flex-col items-center justify-center opacity-40">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Memuat Daftar Siswa...</p>
             </div>
           ) : filteredStudents.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-cream/20 border-b border-border/50">
                       <th className="pl-8 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest w-16">No</th>
                       <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest">Siswa</th>
                       <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Status Kehadiran</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/30 bg-white">
                    {filteredStudents.map((s, idx) => {
                      const currentStatus = statuses[s.id];
                      return (
                        <tr key={s.id} className="hover:bg-indigo-light/20 transition-colors group">
                           <td className="pl-8 py-4 text-[10px] font-bold text-ink-3 tabular-nums">{idx + 1}</td>
                           <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                 <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0", (statusCfg[currentStatus] || statusCfg.hadir).bg)} style={{ color: (statusCfg[currentStatus] || statusCfg.hadir).c }}>
                                    {s.user.name.charAt(0)}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-[12px] font-bold text-ink uppercase truncate leading-none mb-1">{s.user.name}</p>
                                    <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-50">NISN: {s.nisn}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-1.5">
                                 {Object.entries(statusCfg).map(([k, c2]) => {
                                   const isActive = currentStatus === k;
                                   return (
                                     <button 
                                       key={k}
                                       onClick={() => isEditing && updateStatus(s.id, k)}
                                       disabled={!isEditing}
                                       title={isEditing ? c2.label : "Aktifkan Mode Edit untuk mengubah"}
                                       className={cn(
                                         "w-9 h-9 flex items-center justify-center rounded-lg border transition-all",
                                         isActive ? `${c2.bg} ${c2.border}` : "bg-white border-border/50 hover:border-indigo/20 grayscale opacity-40 shadow-sm",
                                         !isEditing && !isActive && "opacity-10 cursor-not-allowed",
                                         isEditing && !isActive && "hover:opacity-100 hover:grayscale-0"
                                       )}
                                     >
                                       <c2.icon size={13} style={{ color: isActive ? c2.c : 'inherit' }} />
                                     </button>
                                   );
                                 })}
                              </div>
                           </td>
                        </tr>
                      );
                    })}
                 </tbody>
               </table>
             </div>
           ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale lowercase">
                 <School size={60} className="mb-4" />
                 <p className="text-sm font-black uppercase tracking-widest">Tidak ada siswa ditemukan di kelas ini</p>
              </div>
           )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
