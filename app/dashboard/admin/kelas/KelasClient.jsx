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
  Download, 
  School,
  X,
  GraduationCap,
  Users,
  ChevronRight,
  Eye
} from "lucide-react";

export default function KelasClient({ initialKelas, teachers }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [kelas, setKelas] = useState(initialKelas);

  useEffect(() => {
    setKelas(initialKelas);
  }, [initialKelas]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({});

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = useMemo(() => {
    return kelas.filter(k => 
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.tingkat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [kelas, searchTerm]);
  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.nama) {
       setFormErrors({ nama: "Nama kelas wajib diisi" });
       toast({
         title: "Gagal Menyimpan",
         description: "Nama kelas tidak boleh kosong.",
         variant: "destructive",
       });
       return;
    }

    setIsSaving(true);
    try {
      const method = editingKelas ? 'PUT' : 'POST';
      const url = editingKelas ? `/api/kelas/${editingKelas.id}` : '/api/kelas';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast({
          title: "Berhasil!",
          description: "Data kelas telah berhasil disimpan ke database.",
          variant: "success",
        });
        setIsModalOpen(false);
        setEditingKelas(null);
        router.refresh();
      } else {
        const err = await res.json();
        toast({
          title: "Gagal Menyimpan",
          description: err.error || "Terjadi kesalahan pada server.",
          variant: "destructive",
        });
      }
    } catch (error) {
       console.error(error);
       toast({
         title: "Kesalahan Koneksi",
         description: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
         variant: "destructive",
       });
    } finally {
       setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!kelasToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/kelas/${kelasToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast({
          title: "Kelas Dihapus",
          description: "Data kelas telah berhasil dihapus dari sistem.",
          variant: "success",
        });
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast({
          title: "Gagal Menghapus",
          description: err.error || "Terjadi kesalahan saat menghapus kelas.",
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
      setKelasToDelete(null);
    }
  };

  const openDeleteConfirm = (id) => {
    setKelasToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-ink tracking-tight uppercase leading-none">Manajemen Ruang Kelas</h1>
              <div className="h-1 w-20 bg-amber-500 mt-3 rounded-full" />
              <p className="text-[11px] text-ink-3 font-bold uppercase tracking-widest mt-4">Daftar Rombongan Belajar & Wali Kelas</p>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-2xl text-[11px] font-black hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest border border-white/10" onClick={() => { setEditingKelas(null); setIsModalOpen(true); }}>
              <Plus size={18} strokeWidth={3} />
              Tambah Kelas
            </button>
          </div>

          <div className="relative group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="CARI NAMA KELAS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-7 py-4 bg-surface border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((k) => (
            <div key={k.id} className="bg-surface border border-border rounded-[40px] p-8 shadow-card hover:shadow-2xl hover:shadow-amber-500/5 transition-all group relative overflow-hidden">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
               
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-[22px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                     <School size={28} strokeWidth={2} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => { setEditingKelas(k); setIsModalOpen(true); }} className="w-9 h-9 flex items-center justify-center bg-white border border-border rounded-xl text-ink-3 hover:text-indigo transition-colors"><Edit size={16} /></button>
                     <button onClick={() => openDeleteConfirm(k.id)} className="w-9 h-9 flex items-center justify-center bg-white border border-border rounded-xl text-ink-3 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
               </div>

               <div>
                  <h3 className="text-2xl font-black text-ink tracking-tight uppercase leading-none mb-2">{k.nama}</h3>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-6">Tingkat {k.tingkat}</p>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl border border-border/50">
                     <div className="flex items-center gap-3">
                        <Users size={16} className="text-ink-3" />
                        <span className="text-[11px] font-black text-ink uppercase tracking-widest leading-none">Total Siswa</span>
                     </div>
                     <span className="text-sm font-black text-ink">{k._count.students}</span>
                  </div>

                  <div className="flex flex-col gap-2 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                     <div className="flex items-center gap-3">
                        <GraduationCap size={16} className="text-indigo/60" />
                        <span className="text-[10px] font-black text-indigo/60 uppercase tracking-widest leading-none">Wali Kelas</span>
                     </div>
                     <p className="text-[13px] font-black text-ink uppercase tracking-tight truncate">{k.waliKelas?.user.name || "Belum Ditentukan"}</p>
                  </div>
               </div>

               <button className="w-full mt-6 py-3 border border-border rounded-2xl text-[10px] font-black text-ink-3 uppercase tracking-widest hover:bg-cream transition-all flex items-center justify-center gap-2">Lihat Detail <ChevronRight size={14} /></button>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="col-span-full py-20 text-center bg-surface border border-dashed border-border rounded-[40px]">
               <School size={48} className="mx-auto text-ink-3/20 mb-4" />
               <p className="text-sm font-black text-ink-3 uppercase tracking-widest">Tidak Ada Kelas Ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-md rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="p-10 border-b border-border bg-amber-50/30 flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[22px] bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/5 shadow-inner">
                     <Plus size={24} strokeWidth={3} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-ink uppercase tracking-tight leading-none">{editingKelas ? "Update Kelas" : "Input Kelas Baru"}</h2>
                     <p className="text-[10px] font-black text-ink-3 mt-3 uppercase tracking-widest opacity-60">Profil Rombongan Belajar</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-ink-3 hover:text-ink"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-10 flex flex-col gap-6">
               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Nama Lengkap Kelas</label>
                  <input type="text" name="nama" defaultValue={editingKelas?.nama} placeholder="CONTOH: X RPL 1" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase tracking-tight focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all", formErrors.nama ? "border-red-500 bg-red-50/10" : "border-border")} />
                  {formErrors.nama && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.nama}</p>}
               </div>

               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Tingkat Pendidikan</label>
                  <select name="tingkat" defaultValue={editingKelas?.tingkat || "X"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                     <option value="X">TINGKAT X (SEPULUH)</option>
                     <option value="XI">TINGKAT XI (SEBELAS)</option>
                     <option value="XII">TINGKAT XII (DUA BELAS)</option>
                  </select>
               </div>

               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Wali Kelas Terdaftar</label>
                  <select name="waliKelasId" defaultValue={editingKelas?.waliKelasId || ""} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                     <option value="">BELUM DITENTUKAN</option>
                     {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                  </select>
               </div>

               <button type="submit" className="w-full mt-4 py-4.5 bg-amber-500 text-white rounded-3xl text-[11px] font-black shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all uppercase tracking-widest border border-white/10">Simpan Kelas</button>
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
        title="Hapus Kelas?"
        message="Data kelas dan seluruh relasi pendaftaran siswa di dalamnya akan dihapus. Lanjutkan?"
        confirmText="Ya, Hapus Kelas"
      />
    </>
  );
}
