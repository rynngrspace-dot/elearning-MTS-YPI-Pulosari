"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  X, 
  Users, 
  Clock, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Eye, 
  Loader2, 
  FileText, 
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const iconMeta = { 
  Matematika: "📐", Fisika: "⚡", Kimia: "🧪", 
  "B. Indonesia": "📝", "B. Inggris": "📖", Sejarah: "🏛️" 
};

export default function GuruTugasClient({ teacherId, assignedClasses, initialTugas }) {
  const router = useRouter();
  const [tugas, setTugas] = useState(initialTugas);
  const [modal, setModal] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const [selectedTugas, setSelectedTugas] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [grading, setGrading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({ judul: "", deskripsi: "", dueDate: "", mappingId: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tugas?t=${Date.now()}`);
      const data = await res.json();
      setTugas(data);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.judul || !form.mappingId || !form.dueDate) return;

    setSaving(true);
    try {
      let fileUrl = "";
      if (file) {
        const BUCKET_TUGAS = "tugas";
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filePath = `${teacherId}/${fileName}`;
        
        console.log(`Uploading to bucket: ${BUCKET_TUGAS}, path: ${filePath}`);
        const { error: uploadError } = await supabase.storage.from(BUCKET_TUGAS).upload(filePath, file);
        
        if (uploadError) {
          alert(`UPLOAD ERROR (${BUCKET_TUGAS}): ${uploadError.message}`);
          throw new Error("Cloud upload failed: " + uploadError.message);
        }
        
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_TUGAS).getPublicUrl(filePath);
        fileUrl = publicUrl;
        console.log("Generated Public URL:", fileUrl);
      }

      const mapping = assignedClasses.find(c => c.id === form.mappingId);
      const res = await fetch('/api/tugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          teacherId,
          mapelId: mapping.mapelId,
          kelasId: mapping.kelasId,
          fileUrl
        })
      });

      if (res.ok) {
        const newTugas = await res.json();
        // INSTANT STATE UPDATE
        setTugas(prev => [newTugas, ...prev]);
        setModal(false);
        setForm({ judul: "", deskripsi: "", dueDate: "", mappingId: "" });
        setFile(null);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = confirmModal.id;
    if (!id) return;
    
    // Find item to get file path
    const item = tugas.find(t => t.id === id);
    if (!item) return;

    setDeleting(true);
    try {
      // 1. Trigger API (which now handles both DB deletion and Recursive Storage cleanup)
      const res = await fetch(`/api/tugas?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        // INSTANT STATE UPDATE
        setTugas(prev => prev.filter(t => t.id !== id));
        setConfirmModal({ open: false, id: null });
      } else {
        const error = await res.json();
        throw new Error(error.message || "Gagal menghapus tugas.");
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const openSubmissions = async (item) => {
    setSelectedTugas(item);
    setSubModal(true);
    setSubmissions([]);
    try {
      const res = await fetch(`/api/tugas/${item.id}/submissions`);
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrade = async (subId, score) => {
    setGrading(true);
    try {
      const res = await fetch(`/api/tugas/${selectedTugas.id}/submissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: subId, score: Number(score) })
      });
      if (res.ok) {
        setSubmissions(p => p.map(s => s.id === subId ? { ...s, nilai: Number(score), status: "Graded" } : s));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGrading(false);
    }
  };

  const filtered = tugas.filter(t => t.judul.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 flex flex-col gap-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-md">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="px-2.5 py-1 bg-indigo-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-[0.2em]">Pusat Evaluasi</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[9px] text-ink-3 font-bold uppercase tracking-widest leading-none">Manajemen Tugas Siswa</p>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight uppercase leading-none">Kelola Tugas</h1>
          </div>
        </div>

        <button 
          onClick={() => setModal(true)}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo/20 hover:bg-indigo-600 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} /> Buat Tugas Baru
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="relative group max-w-sm w-full">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="CARI JUDUL TUGAS..." 
              className="w-full pl-11 pr-6 py-3.5 bg-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all shadow-sm"
            />
         </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center opacity-40">
           <Loader2 size={48} className="animate-spin mb-4" />
           <p className="text-[10px] font-bold uppercase tracking-widest">Sinkronisasi Database...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-cream/20 border-b border-border/50">
                    <th className="pl-8 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest w-16">No</th>
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest">Tugas & Alokasi</th>
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Tenggat Waktu</th>
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Pengumpulan</th>
                    <th className="pr-8 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-white">
                 {filtered.map((t, idx) => {
                   const isPast = new Date(t.dueDate) < new Date();
                   return (
                     <tr key={t.id} className="hover:bg-indigo-light/20 transition-colors group">
                        <td className="pl-8 py-4 text-[10px] font-bold text-ink-3 tabular-nums">{idx + 1}</td>
                        <td className="px-4 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-indigo-light flex items-center justify-center text-indigo shadow-inner text-lg">
                                 {iconMeta[t.mapel.nama] || "📝"}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[12px] font-bold text-ink uppercase truncate leading-none mb-1.5">{t.judul}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-lg bg-indigo text-white text-[7px] font-bold uppercase tracking-widest">
                                      {t.mapel.nama}
                                    </span>
                                    <div className="h-1 w-1 rounded-full bg-border" />
                                    <span className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-50">Kelas {t.kelas.nama}</span>
                                    {t.fileUrl && (
                                       <>
                                         <div className="h-1 w-1 rounded-full bg-border" />
                                         <span className="text-[8px] font-bold text-indigo uppercase tracking-widest bg-indigo-light px-1.5 py-0.5 rounded-md">
                                            {t.fileUrl.split('.').pop()}
                                         </span>
                                       </>
                                    )}
                                 </div>
                                 <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-30 mt-1.5">DIBUAT: {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-4 py-4">
                           <div className="flex flex-col items-center gap-1">
                              <div className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight", isPast ? "text-red-500" : "text-ink")}>
                                 <Clock size={12} />
                                 {new Date(t.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </div>
                              <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-40">Jam 23:59</p>
                           </div>
                        </td>
                        <td className="px-4 py-4">
                           <div className="flex flex-col items-center gap-2 min-w-[120px]">
                              <div className="flex justify-between w-full text-[9px] font-bold uppercase tracking-widest text-ink-3">
                                 <span>{t._count.submissions} Siswa</span>
                                 <span>{Math.round((t._count.submissions / 32) * 100)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                                 <div 
                                   className="h-full bg-indigo transition-all duration-500" 
                                   style={{ width: `${(t._count.submissions / 32) * 100}%` }}
                                 />
                              </div>
                           </div>
                        </td>
                        <td className="pr-8 py-4">
                           <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => router.push(`/dashboard/guru/tugas/${t.id}`)}
                                className="px-4 py-2 bg-indigo-light text-indigo rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-indigo hover:text-white transition-all shadow-sm"
                              >
                                Detail & Jawaban
                              </button>
                              <button 
                                onClick={() => setConfirmModal({ open: true, id: t.id })}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   );
                 })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center opacity-30 grayscale lowercase border-2 border-dashed border-border rounded-2xl">
           <AlertCircle size={60} className="mb-4" />
           <p className="text-[10px] font-bold uppercase tracking-widest">Tidak ada tugas ditemukan</p>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-ink/30 backdrop-blur-md animate-fadeIn">
           <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-border animate-slideUp">
              <div className="p-8 flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-inner animate-pulse">
                    <AlertCircle size={32} />
                 </div>
                 <h3 className="text-lg font-black text-ink uppercase tracking-tight leading-tight mb-2">Hapus Tugas?</h3>
                 <p className="text-[11px] font-bold text-ink-3 uppercase tracking-widest leading-relaxed opacity-60">
                    Siswa tidak akan bisa mengirim jawaban lagi. Lanjutkan?
                 </p>
              </div>
              <div className="p-6 bg-cream/30 border-t border-border/50 flex gap-3">
                 <button 
                   onClick={() => setConfirmModal({ open: false, id: null })}
                   disabled={deleting}
                   className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-ink-3 hover:bg-white rounded-2xl border border-transparent hover:border-border transition-all disabled:opacity-50"
                 >
                    Batal
                 </button>
                 <button 
                   onClick={handleDelete}
                   disabled={deleting}
                   className="flex-1 py-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {deleting && <Loader2 size={14} className="animate-spin" />}
                    {deleting ? "MENGHAPUS..." : "YA, HAPUS"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/30 backdrop-blur-md animate-fadeIn">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-border animate-slideUp">
              <div className="p-8 border-b border-border/50 bg-cream/30 flex justify-between items-center">
                 <div>
                    <h3 className="text-lg font-black text-ink uppercase tracking-tight leading-none mb-1.5">Tugas Baru</h3>
                    <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest leading-none">Register Learning Task</p>
                 </div>
                 <button onClick={() => setModal(false)} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-red-50 transition-all text-ink-3">
                    <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleCreate} className="p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                 <div>
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Judul Tugas</label>
                    <input 
                      type="text" required
                      value={form.judul}
                      onChange={e => setForm(p => ({ ...p, judul: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-cream/20 border border-border/50 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Alokasi Kelas</label>
                       <select 
                         required
                         value={form.mappingId}
                         onChange={e => setForm(p => ({ ...p, mappingId: e.target.value }))}
                         className="w-full px-4 py-3 bg-cream/20 border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none"
                       >
                          <option value="">-- PILIH --</option>
                          {assignedClasses.map(c => (
                            <option key={c.id} value={c.id}>{c.mapelName} · {c.kelasName}</option>
                          ))}
                       </select>
                    </div>
                    <div>
                       <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Tenggat Waktu</label>
                       <input 
                         type="date" required
                         value={form.dueDate}
                         onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                         className="w-full px-4 py-3 bg-cream/20 border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Instruksi Tugas</label>
                    <textarea 
                      rows={3} required
                      value={form.deskripsi}
                      onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-cream/20 border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all"
                    />
                 </div>

                 <div>
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Sematkan File (Opsional)</label>
                    <input 
                      type="file"
                      onChange={e => setFile(e.target.files[0])}
                      className="text-[10px] font-bold text-ink-3"
                    />
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-ink-3 hover:bg-cream rounded-xl transition-all">Batal</button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1 py-4 bg-indigo text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-indigo/20 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                    >
                       {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                       Publish Tugas
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {subModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/30 backdrop-blur-md animate-fadeIn">
           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-border animate-slideUp">
              <div className="p-8 border-b border-border/50 bg-cream/30 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo text-white flex items-center justify-center shadow-lg shadow-indigo/20">
                       <GraduationCap size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-ink uppercase tracking-tight leading-none mb-1.5">Daftar Pengumpulan</h3>
                        <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest leading-none">Student Submissions for {selectedTugas?.judul}</p>
                    </div>
                 </div>
                 <button onClick={() => setSubModal(false)} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-red-50 transition-all text-ink-3">
                    <X size={18} />
                 </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                 {submissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {submissions.map(s => (
                         <div key={s.id} className="p-5 border border-border rounded-xl bg-surface hover:border-indigo/20 transition-all flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                               <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center text-[13px] font-black text-indigo shrink-0">
                                  {s.student.user.name.charAt(0)}
                               </div>
                               <div className="min-w-0">
                                  <p className="text-[12px] font-bold text-ink uppercase truncate leading-none mb-1">{s.student.user.name}</p>
                                  <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-50">NISN: {s.student.nisn}</p>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0">
                               <button 
                                 onClick={() => window.open(s.fileUrl, '_blank')}
                                 className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-[9px] font-bold uppercase tracking-widest text-indigo hover:bg-indigo hover:text-white transition-all shadow-sm"
                               >
                                  <Download size={12} /> File 
                               </button>
                               <div className="flex flex-col gap-1 items-end min-w-[60px]">
                                  <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-40 leading-none">NILAI</p>
                                  <input 
                                    type="number" 
                                    defaultValue={s.nilai || ""}
                                    onBlur={(e) => handleGrade(s.id, e.target.value)}
                                    placeholder="--" 
                                    className="w-full text-center px-2 py-1 bg-white border border-border rounded font-black text-[14px] text-indigo focus:outline-none focus:ring-2 focus:ring-indigo/20"
                                  />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale lowercase">
                       <Loader2 size={40} className="animate-spin mb-4" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada siswa yang mengumpulkan</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
