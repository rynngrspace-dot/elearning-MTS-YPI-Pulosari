"use client";

import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  User, 
  FileText,
  Calendar,
  GraduationCap,
  Loader2,
  TrendingUp,
  Filter,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TugasDetailClient({ tugas, students, initialSubmissions }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStat, setFilterStat] = useState("Semua");
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [gradingId, setGradingId] = useState(null);

  // Status mapping logic
  const studentMatrix = useMemo(() => {
    return students.map(student => {
      const submission = submissions.find(s => s.studentId === student.id);
      let status = "Belum";
      if (submission) {
        const isLate = new Date(submission.submittedAt) > new Date(tugas.dueDate);
        status = isLate ? "Terlambat" : "Terkumpul";
      }
      return { 
        ...student, 
        submission, 
        status 
      };
    });
  }, [students, submissions, tugas.dueDate]);

  const filtered = studentMatrix.filter(s => {
    const matchesSearch = s.user.name.toLowerCase().includes(search.toLowerCase()) || (s.nisn && s.nisn.includes(search));
    const matchesFilter = filterStat === "Semua" || s.status === filterStat;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: students.length,
    submitted: studentMatrix.filter(s => s.status !== "Belum").length,
    missing: studentMatrix.filter(s => s.status === "Belum").length,
    late: studentMatrix.filter(s => s.status === "Terlambat").length
  };

  const handleGrade = async (subId, score) => {
    if (!subId || score === "") return;
    setGradingId(subId);
    try {
      const res = await fetch(`/api/tugas/${tugas.id}/submissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: subId, score: Number(score) })
      });
      if (res.ok) {
        const updated = await res.json();
        setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, nilai: updated.nilai, status: "Graded" } : s));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGradingId(null);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-8 animate-fadeIn">
      {/* BACK BUTTON */}
      <button 
        onClick={() => router.push("/dashboard/guru/tugas")}
        className="flex items-center gap-2 text-[10px] font-bold text-ink-3 uppercase tracking-widest hover:text-indigo transition-colors w-fit"
      >
        <ArrowLeft size={16} /> Kembali ke Kelola Tugas
      </button>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo text-white shadow-xl">
         {/* Background pattern decor */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />

         <div className="relative p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-widest leading-none">
                     Detail Evaluasi
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                     {tugas.mapel.nama} · Kelas {tugas.kelas.nama}
                  </span>
               </div>
               <h1 className="text-2xl font-black tracking-tight mb-2 leading-none uppercase flex items-center gap-3">
                  {tugas.judul}
                  <TrendingUp className="text-indigo-300" size={20} />
               </h1>
               <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      <Calendar size={12} className="text-indigo-300" />
                      {new Date(tugas.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      <Users size={12} className="text-indigo-300" />
                      {stats.total} Siswa
                   </div>
                   {tugas.fileUrl && (
                     <button 
                       onClick={() => window.open(tugas.fileUrl, '_blank')}
                       className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-all border border-white/10 ml-auto lg:ml-0"
                     >
                       <Download size={12} />
                       Unduh Instruksi
                     </button>
                   )}
               </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-6 min-w-[240px] shadow-inner">
               <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                     <circle 
                        cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - stats.submitted / stats.total)}
                        className="text-white"
                        strokeLinecap="round"
                    />
                  </svg>
                  <p className="absolute text-sm font-black">{Math.round((stats.submitted / stats.total) * 100)}%</p>
               </div>
               <div>
                  <p className="text-[20px] font-black tracking-tight leading-none mb-1">{stats.submitted}</p>
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Terkumpul</p>
               </div>
            </div>
         </div>
      </div>

      {/* ANALYTICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total Siswa", val: stats.total, color: "bg-surface text-ink", icon: Users },
           { label: "Terkumpul", val: stats.submitted - stats.late, color: "bg-green-50 text-green-600", icon: CheckCircle2 },
           { label: "Terlambat", val: stats.late, color: "bg-orange-50 text-orange-600", icon: Clock },
           { label: "Belum", val: stats.missing, color: "bg-red-50 text-red-600", icon: AlertCircle }
         ].map(s => (
           <div key={s.label} className={cn("p-6 rounded-3xl border border-border shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-all", s.color)}>
              <div>
                 <p className="text-[24px] font-black tracking-tight leading-none mb-1">{s.val}</p>
                 <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{s.label}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/50 border border-current/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                 <s.icon size={20} />
              </div>
           </div>
         ))}
      </div>

      {/* SUBMISSION LIST SECTION */}
      <div className="flex flex-col gap-6">
         {/* TOOLBAR */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex overflow-x-auto gap-2 pb-2 lg:pb-0">
               {["Semua", "Terkumpul", "Terlambat", "Belum"].map(f => (
                 <button 
                   key={f}
                   onClick={() => setFilterStat(f)}
                   className={cn(
                     "px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border shrink-0",
                     filterStat === f ? "bg-indigo text-white border-indigo shadow-md" : "bg-surface border-border text-ink-3 hover:border-indigo/20"
                   )}
                 >
                   {f}
                 </button>
               ))}
            </div>

            <div className="relative group max-w-sm w-full">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
               <input 
                 type="text" 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 placeholder="CARI NAMA / NISN..." 
                 className="w-full pl-11 pr-6 py-3.5 bg-surface border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all shadow-sm"
               />
            </div>
         </div>

         {/* MATRIX TABLE */}
         <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-cream/20 border-b border-border/50">
                     <th className="pl-8 py-5 text-[9px] font-bold text-ink-3 uppercase tracking-widest w-16">No</th>
                     <th className="px-6 py-5 text-[9px] font-bold text-ink-3 uppercase tracking-widest">Siswa</th>
                     <th className="px-6 py-5 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Waktu Kumpul</th>
                     <th className="px-6 py-5 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Berkas</th>
                     <th className="px-6 py-5 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Nilai</th>
                     <th className="pr-8 py-5 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30 bg-white">
                  {filtered.length > 0 ? filtered.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-indigo-light/20 transition-colors group">
                       <td className="pl-8 py-5 text-[10px] font-bold text-ink-3 tabular-nums">{idx + 1}</td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-light flex items-center justify-center text-indigo text-[13px] font-black shrink-0 shadow-inner">
                                {s.user.name.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                <p className="text-[12px] font-bold text-ink uppercase truncate leading-none mb-1.5 group-hover:text-indigo transition-colors">{s.user.name}</p>
                                <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-40">NISN: {s.nisn || "—"}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-0.5">
                             <p className={cn("text-[10px] font-bold uppercase tracking-widest", s.submission ? "text-ink" : "text-ink-3 opacity-20")}>
                                {s.submission ? new Date(s.submission.submittedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
                             </p>
                             {s.submission && (
                               <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-30">Pukul {new Date(s.submission.submittedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                             )}
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex justify-center">
                             {s.submission ? (
                                <button 
                                  onClick={() => window.open(s.submission.fileUrl, "_blank")}
                                  className="w-10 h-10 rounded-xl bg-indigo-light text-indigo flex items-center justify-center hover:bg-indigo hover:text-white transition-all shadow-sm group-hover:scale-110"
                                >
                                   <FileText size={16} />
                                </button>
                             ) : (
                                <span className="w-10 h-10 rounded-xl border border-dashed border-border flex items-center justify-center opacity-20 grayscale">
                                   <AlertCircle size={16} />
                                </span>
                             )}
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                             <div className="relative group/input w-full">
                                <input 
                                  type="number"
                                  min="0" max="100"
                                  disabled={!s.submission}
                                  defaultValue={s.submission?.nilai || ""}
                                  onBlur={(e) => handleGrade(s.submission?.id, e.target.value)}
                                  placeholder="—"
                                  className={cn(
                                    "w-full text-center py-2 bg-surface border rounded-xl text-[14px] font-black focus:outline-none focus:ring-4 transition-all",
                                    !s.submission ? "opacity-20 cursor-not-allowed" : "border-border focus:ring-indigo/10 group-hover/input:border-indigo/30",
                                    s.submission?.nilai ? "text-indigo" : "text-ink-3"
                                  )}
                                />
                                {gradingId === s.submission?.id && (
                                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                                     <Loader2 size={12} className="animate-spin text-indigo" />
                                  </div>
                                )}
                             </div>
                          </div>
                       </td>
                       <td className="pr-8 py-5">
                          <div className="flex justify-center">
                             <div className={cn(
                               "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm",
                               s.status === "Terkumpul" ? "bg-green-50 text-green-600 border-green-200" :
                               s.status === "Terlambat" ? "bg-orange-50 text-orange-600 border-orange-200" :
                               "bg-slate-50 text-slate-400 border-slate-200 grayscale-[0.5]"
                             )}>
                                {s.status === "Terkumpul" && <CheckCircle2 size={10} />}
                                {s.status === "Terlambat" && <Clock size={10} />}
                                {s.status === "Belum" && <AlertCircle size={10} />}
                                {s.status}
                             </div>
                          </div>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={6} className="py-24 text-center opacity-30 grayscale lowercase border-t border-border/50 bg-cream/5">
                          <AlertCircle size={48} className="mx-auto mb-4" />
                          <p className="text-[11px] font-bold uppercase tracking-widest italic">Tidak ada siswa yang sesuai kriteria</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
