"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  Briefcase,
  User,
  BookMarked,
  School,
  CalendarClock,
  X,
  ChevronRight,
  Info
} from "lucide-react";

export default function PengampuClient({ initialData, teachers, mapels, kelas, academics }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({});

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(a => 
      a.teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mapel.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.kelas.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);
  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    // Validation
    let errors = {};
    if (!body.teacherId) errors.teacherId = "Mohon pilih guru";
    if (!body.mapelId) errors.mapelId = "Mohon pilih mata pelajaran";
    if (!body.kelasId) errors.kelasId = "Mohon pilih kelas";

    if (Object.keys(errors).length > 0) {
       setFormErrors(errors);
       toast({
         title: "Data Belum Lengkap",
         description: "Semua kolom pilihan wajib diisi.",
         variant: "destructive",
       });
       return;
    }

    setIsSaving(true);
    try {
      const method = editingAssignment ? 'PUT' : 'POST';
      const url = editingAssignment ? `/api/pengampu/${editingAssignment.id}` : '/api/pengampu';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast({
          title: "Berhasil!",
          description: "Penugasan pengampu telah berhasil disimpan.",
          variant: "success",
        });
        setIsModalOpen(false);
        setEditingAssignment(null);
        router.refresh();
      } else {
        const err = await res.json();
        toast({
          title: "Gagal Menyimpan",
          description: err.error || "Penugasan mungkin sudah ada (duplikat).",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Kesalahan Koneksi",
        description: "Tidak dapat terhubung ke server.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assignmentToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pengampu/${assignmentToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast({
          title: "Penugasan Dihapus",
          description: "Data penugasan pengampu telah berhasil dihapus.",
          variant: "success",
        });
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast({
          title: "Gagal Menghapus",
          description: err.error || "Terjadi kesalahan saat menghapus data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Kesalahan Koneksi",
        description: "Tidak dapat terhubung ke server.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setAssignmentToDelete(null);
    }
  };

  const openDeleteConfirm = (id) => {
    setAssignmentToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-ink tracking-tight uppercase leading-none">Penugasan Pengampu</h1>
              <div className="h-1 w-20 bg-emerald-500 mt-3 rounded-full" />
              <p className="text-[11px] text-ink-3 font-bold uppercase tracking-widest mt-4">Atur Jadwal & Guru Mata Pelajaran</p>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[11px] font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest border border-white/10" onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}>
              <Plus size={18} strokeWidth={3} />
              Tambah Pengampu
            </button>
          </div>

          <div className="relative group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="CARI GURU, MAPEL, ATAU KELAS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-7 py-4 bg-surface border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[40px] overflow-hidden shadow-card p-2">
            <div className="overflow-x-auto rounded-[32px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/40">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Tahun Ajaran</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Guru Pengampu</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Mata Pelajaran</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Unit Kelas</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredData.map((a) => (
                    <tr key={a.id} className="hover:bg-cream/20 transition-all group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-[11px] font-black text-ink uppercase tracking-tighter">
                            <CalendarClock size={14} className="text-emerald-500" />
                            {a.tahunAjaran.tahun} ({a.tahunAjaran.semester})
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo/5 border border-indigo/10 flex items-center justify-center text-indigo group-hover:bg-indigo group-hover:text-white transition-all text-xs font-black shadow-inner uppercase">
                            {a.teacher.user.name?.charAt(0)}
                          </div>
                          <span className="text-[14px] font-black text-ink uppercase tracking-tight">{a.teacher.user.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-xl border border-emerald-100 uppercase tracking-widest">
                          {a.mapel.nama}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-xl border border-amber-100 uppercase tracking-widest">
                          {a.kelas.nama}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right space-x-1">
                         <button onClick={() => openDeleteConfirm(a.id)} className="w-9 h-9 inline-flex items-center justify-center bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} strokeWidth={2.5}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-lg rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="p-10 border-b border-border bg-emerald-50/30 flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[22px] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/5 shadow-inner">
                     <Briefcase size={24} strokeWidth={3} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-ink uppercase tracking-tight leading-none">Penugasan Guru</h2>
                     <p className="text-[10px] font-black text-ink-3 mt-3 uppercase tracking-widest opacity-60">Input Pemetaan Pengampu</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-ink-3 hover:text-ink"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-10 flex flex-col gap-6">
               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Pilih Guru</label>
                  <select name="teacherId" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none transition-all", formErrors.teacherId ? "border-red-500 bg-red-50/10" : "border-border")}>
                     <option value="">CARI NAMA GURU</option>
                     {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                  </select>
                  {formErrors.teacherId && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.teacherId}</p>}
               </div>

               <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2.5">
                     <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Mata Pelajaran</label>
                     <select name="mapelId" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none transition-all", formErrors.mapelId ? "border-red-500 bg-red-50/10" : "border-border")}>
                        <option value="">PILIH MAPEL</option>
                        {mapels.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                     </select>
                     {formErrors.mapelId && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.mapelId}</p>}
                  </div>
                  <div className="flex flex-col gap-2.5">
                     <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Unit Kelas</label>
                     <select name="kelasId" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none transition-all", formErrors.kelasId ? "border-red-500 bg-red-50/10" : "border-border")}>
                        <option value="">PILIH KELAS</option>
                        {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                     </select>
                     {formErrors.kelasId && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.kelasId}</p>}
                  </div>
               </div>

               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Tahun Ajaran Aktif</label>
                  <select name="tahunAjaranId" className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none transition-all">
                     {academics.map(a => <option key={a.id} value={a.id}>{a.tahun} ({a.semester}) {a.isActive ? '- AKTIF' : ''}</option>)}
                  </select>
               </div>

               <div className="p-6 bg-emerald-50/50 border border-emerald-200 rounded-[30px] flex gap-4">
                  <Info size={20} className="text-emerald-600 shrink-0" />
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider leading-relaxed">
                     Satu guru dapat mengampu beberapa mata pelajaran di kelas yang berbeda. Gunakan <span className="font-black italic">Tahun Ajaran</span> yang sesuai.
                  </p>
               </div>

               <button type="submit" className="w-full mt-2 py-4.5 bg-emerald-500 text-white rounded-3xl text-[11px] font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all uppercase tracking-widest border border-white/10">Publish Penugasan</button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Penugasan?"
        message="Menghapus data ini akan memutus relasi antara guru dan kelas untuk mata pelajaran tersebut. Lanjutkan?"
        confirmText="Ya, Hapus Data"
      />
    </>
  );
}
