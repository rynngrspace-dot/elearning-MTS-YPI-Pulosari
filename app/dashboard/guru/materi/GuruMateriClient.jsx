"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Upload, 
  Trash2, 
  Eye, 
  X, 
  Paperclip, 
  FileText, 
  Plus, 
  Search, 
  BookOpen,
  School,
  Loader2,
  FileDown,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const iconMeta = { 
  Matematika: "📐", Fisika: "⚡", Kimia: "🧪", 
  "B. Indonesia": "📝", "B. Inggris": "📖", Sejarah: "🏛️" 
};

export default function GuruMateriClient({ teacherId, assignedClasses, initialMaterials }) {
  const router = useRouter();
  const [materials, setMaterials] = useState(initialMaterials);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const [search, setSearch] = useState("");
  const [filterMapel, setFilterMapel] = useState("Semua");
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({ judul: "", deskripsi: "", mappingId: "" });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Add timestamp to prevent caching
      const res = await fetch(`/api/materi?t=${Date.now()}`);
      const data = await res.json();
      setMaterials(data);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    setFileError("");
    if (!selected) return;

    // Validation: Max 1MB
    if (selected.size > 1024 * 1024) {
      setFileError("UKURAN FILE MAKSIMAL 1MB");
      setFile(null);
      return;
    }

    // Validation: Typs
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(selected.type)) {
       setFileError("HANYA PDF ATAU WORD (.DOCX)");
       setFile(null);
       return;
    }

    setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.judul || !form.mappingId || !file) return;

    setSaving(true);
    try {
      // 1. Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const filePath = `materi/${teacherId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('materi')
        .upload(filePath, file);

      if (uploadError) throw new Error("Gagal mengunggah ke Cloud Storage: " + uploadError.message);

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('materi')
        .getPublicUrl(filePath);

      // 3. Save to internal DB via API
      const mapping = assignedClasses.find(c => c.id === form.mappingId);
      const res = await fetch('/api/materi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: form.judul,
          deskripsi: form.deskripsi,
          teacherId,
          mapelId: mapping.mapelId,
          kelasId: mapping.kelasId,
          fileUrl: publicUrl
        })
      });

      if (res.ok) {
        const newMateri = await res.json();
        // INSTANT STATE UPDATE (Add to front)
        setMaterials(prev => [newMateri, ...prev]);
        setModal(false);
        setForm({ judul: "", deskripsi: "", mappingId: "" });
        setFile(null);
      } else {
         const errData = await res.json();
         throw new Error(errData.error || "Gagal sinkronisasi database");
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const id = confirmModal.id;
    if (!id) return;
    
    // Find item to get file path
    const item = materials.find(m => m.id === id);
    if (!item) return;

    setDeleting(true);
    try {
      // 1. Delete from Supabase Storage first
      // Extract path: everything after /public/materi/
      const pathParts = item.fileUrl.split('/public/materi/');
      if (pathParts.length > 1) {
         const storagePath = pathParts[1];
         console.log("Removing from storage:", storagePath);
         const { error: storageError } = await supabase.storage.from('materi').remove([storagePath]);
         
         if (storageError) {
            console.error("Storage delete error:", storageError);
            throw new Error(`Gagal menghapus file di Cloud: ${storageError.message}. Pastikan izin DELETE aktif di Supabase Dashboard.`);
         }
      }

      // 2. Delete from DB
      const res = await fetch(`/api/materi?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        // INSTANT STATE UPDATE (Filter out)
        setMaterials(prev => prev.filter(m => m.id !== id));
        setConfirmModal({ open: false, id: null });
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = materials.filter(m => {
    const matchesSearch = m.judul.toLowerCase().includes(search.toLowerCase());
    const matchesMapel = filterMapel === "Semua" || m.mapel.nama === filterMapel;
    return matchesSearch && matchesMapel;
  });

  // Extract unique mapel from assigned classes
  const uniqueMapel = ["Semua", ...new Set(assignedClasses.map(c => c.mapelName))];

  return (
    <div className="p-8 flex flex-col gap-8 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-md">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="px-2.5 py-1 bg-indigo-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-[0.2em]">Repository Digital</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[9px] text-ink-3 font-bold uppercase tracking-widest leading-none">Manajemen Materi Pelajaran</p>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight uppercase leading-none">Materi Pembelajaran</h1>
          </div>
        </div>

        <button 
          onClick={() => setModal(true)}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo/20 hover:bg-indigo-600 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} /> Upload Materi
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-hide">
            {uniqueMapel.map(m => (
              <button 
                key={m} 
                onClick={() => setFilterMapel(m)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border shrink-0",
                  filterMapel === m 
                    ? "bg-indigo text-white border-indigo shadow-md shadow-indigo/10" 
                    : "bg-surface border-border hover:border-indigo/10 text-ink-3"
                )}
              >
                {m}
              </button>
            ))}
         </div>

         <div className="relative group max-w-sm w-full">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="CARI JUDUL MATERI..." 
              className="w-full pl-11 pr-6 py-3.5 bg-surface border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all shadow-sm group-hover:border-indigo/20"
            />
         </div>
      </div>

      {/* MATERIALS TABLE */}
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
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest">Materi & Alokasi</th>
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest hidden lg:table-cell">Deskripsi</th>
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Tanggal Upload</th>
                    <th className="px-4 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Tipe & Statistik</th>
                    <th className="pr-8 py-4 text-[9px] font-bold text-ink-3 uppercase tracking-widest text-center">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-white">
                 {filtered.map((m, idx) => (
                   <tr key={m.id} className="hover:bg-indigo-light/20 transition-colors group">
                      <td className="pl-8 py-4 text-[10px] font-bold text-ink-3 tabular-nums">{idx + 1}</td>
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-light flex items-center justify-center text-indigo shadow-inner text-lg shrink-0">
                               {iconMeta[m.mapel.nama] || "📚"}
                            </div>
                            <div className="min-w-0">
                               <p className="text-[12px] font-bold text-ink uppercase truncate leading-none mb-1.5">{m.judul}</p>
                               <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-lg bg-indigo text-white text-[7px] font-bold uppercase tracking-widest">
                                    {m.mapel.nama}
                                  </span>
                                  <div className="h-1 w-1 rounded-full bg-border" />
                                  <span className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-50">Kelas {m.kelas.nama}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                         <p className="text-[10px] text-ink-3 leading-relaxed line-clamp-1 italic max-w-xs">{m.deskripsi || "-"}</p>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
                            <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">
                               {new Date(m.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-30">Pukul {new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex flex-col items-center gap-0.5">
                            <p className="text-[9px] font-extrabold text-indigo uppercase bg-indigo-light px-2 py-0.5 rounded-md">
                               {m.fileUrl.split('.').pop() || "FILE"}
                            </p>
                            <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-40">0 Unduhan</p>
                         </div>
                      </td>
                      <td className="pr-8 py-4">
                         <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => window.open(m.fileUrl, '_blank')}
                              className="w-8 h-8 rounded-lg bg-indigo-light text-indigo flex items-center justify-center hover:bg-indigo hover:text-white transition-all shadow-sm group-hover:scale-110"
                              title="Lihat File"
                            >
                               <Eye size={14} />
                            </button>
                            <a 
                              href={m.fileUrl} 
                              download={m.judul}
                              className="w-8 h-8 rounded-lg bg-indigo-light text-indigo flex items-center justify-center hover:bg-indigo hover:text-white transition-all shadow-sm group-hover:scale-110"
                              title="Download File"
                            >
                               <FileDown size={14} />
                            </a>
                            <button 
                              onClick={() => setConfirmModal({ open: true, id: m.id })}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm group-hover:scale-110"
                              title="Hapus"
                            >
                               <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-30 grayscale lowercase border-2 border-dashed border-border rounded-2xl">
           <AlertCircle size={60} className="mb-4" />
           <p className="text-[10px] font-bold uppercase tracking-widest">Tidak ada materi ditemukan</p>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/30 backdrop-blur-md animate-fadeIn">
           <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-border animate-slideUp">
              <div className="p-8 flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-inner animate-pulse">
                    <AlertCircle size={32} />
                 </div>
                 <h3 className="text-lg font-black text-ink uppercase tracking-tight leading-tight mb-2">Hapus Materi?</h3>
                 <p className="text-[11px] font-bold text-ink-3 uppercase tracking-widest leading-relaxed opacity-60">
                    Data yang dihapus tidak dapat dikembalikan. Lanjutkan?
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

      {/* UPLOAD MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/30 backdrop-blur-md animate-fadeIn">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-border animate-slideUp">
              <div className="p-8 border-b border-border/50 flex justify-between items-center bg-cream/30">
                 <div>
                    <h3 className="text-lg font-black text-ink uppercase tracking-tight leading-none mb-1.5">Tambah Materi</h3>
                    <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest leading-none">Register Learning Resource</p>
                 </div>
                 <button onClick={() => setModal(false)} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all text-ink-3">
                    <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleUpload} className="p-8 flex flex-col gap-6">
                 <div>
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-3 block">Pilih Dokumen (PDF / Word)</label>
                    <label className={cn(
                      "group/file relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
                      file ? "bg-indigo-light border-indigo/30" : fileError ? "bg-red-50 border-red-200" : "bg-cream/10 border-border hover:border-indigo/20"
                    )}>
                       <input 
                         type="file" 
                         className="hidden" 
                         accept=".pdf,.doc,.docx"
                         onChange={onFileChange}
                       />
                       {file ? (
                         <div className="flex flex-col items-center text-center">
                            <FileText size={32} className="text-indigo mb-3" />
                            <p className="text-[10px] font-bold text-ink uppercase tracking-tight mb-1">{file.name}</p>
                            <p className="text-[9px] font-bold text-indigo uppercase">{(file.size / 1024).toFixed(0)} KB · SIAP UNGGAH</p>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center text-center">
                            <Upload size={32} className={cn("mb-3 transition-colors", fileError ? "text-red-400" : "text-ink-3 group-hover/file:text-indigo")} />
                            <p className={cn("text-[10px] font-bold uppercase tracking-tight mb-1", fileError ? "text-red-600" : "text-ink")}>
                              {fileError || "KLIK UNTUK PILIH FILE"}
                            </p>
                            <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest opacity-40">MAKSIMAL 1MB · PDF / DOCX</p>
                         </div>
                       )}
                    </label>
                 </div>

                 <div>
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Judul Materi</label>
                    <input 
                      type="text" 
                      required
                      value={form.judul}
                      onChange={e => setForm(p => ({ ...p, judul: e.target.value }))}
                      placeholder="MISAL: PERSAMAAN KUADRAT PART 1"
                      className="w-full px-5 py-3.5 bg-cream/20 border border-border/50 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    <div>
                       <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Pilih Kelas / Mapel</label>
                       <select 
                         required
                         value={form.mappingId}
                         onChange={e => setForm(p => ({ ...p, mappingId: e.target.value }))}
                         className="w-full px-5 py-3.5 bg-cream/20 border border-border/50 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:outline-none transition-all appearance-none cursor-pointer"
                       >
                          <option value="">-- PILIH ALOKASI --</option>
                          {assignedClasses.map(c => (
                            <option key={c.id} value={c.id}>{c.mapelName} · KELAS {c.kelasName}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mb-2 block">Deskripsi Singkat</label>
                    <textarea 
                      rows={3}
                      value={form.deskripsi}
                      onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))}
                      placeholder="BERIKAN KETERANGAN SINGKAT MENGENAI MATERI INI..."
                      className="w-full px-5 py-3.5 bg-cream/20 border border-border/50 rounded-xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all resize-none"
                    />
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setModal(false)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-ink-3 hover:bg-cream rounded-xl transition-all">Batal</button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1 py-4 bg-indigo text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-indigo/20 hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                       {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                       Upload Materi
                    </button>
                 </div>
              </form>
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
