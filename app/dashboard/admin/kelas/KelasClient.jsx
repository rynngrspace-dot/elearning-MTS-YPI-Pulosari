"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { createKelasAction, updateKelasAction, deleteKelasAction, bulkDeleteKelasAction } from "@/lib/actions/kelas-actions";
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
  Eye,
  LayoutGrid,
  List,
  Users,
  ChevronRight,
  Shuffle
} from "lucide-react";
import Link from "next/link";
import { shuffleStudentsAction } from "@/lib/actions/siswa-actions";

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

  const [selectedKelasIds, setSelectedKelasIds] = useState([]);

  const toggleSelectKelas = (id) => {
    setSelectedKelasIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedKelasIds.length === filteredData.length) {
      setSelectedKelasIds([]);
    } else {
      setSelectedKelasIds(filteredData.map(k => k.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedKelasIds.length === 0) return;
    
    if (!confirm(`Hapus ${selectedKelasIds.length} kelas terpilih secara permanen?`)) return;

    setIsDeleting(true);
    try {
      const res = await bulkDeleteKelasAction(selectedKelasIds);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: `${selectedKelasIds.length} data kelas telah dihapus.`,
          variant: "success",
        });
        setSelectedKelasIds([]);
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({ title: "Kesalahan", description: "Terjadi kesalahan saat menghapus data massal.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  const [isShuffleModalOpen, setIsShuffleModalOpen] = useState(false);
  const [selectedClassesForShuffle, setSelectedClassesForShuffle] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = async () => {
    if (selectedClassesForShuffle.length === 0) {
      return toast({
        title: "Pilih Kelas",
        description: "Silakan pilih minimal satu kelas tujuan.",
        variant: "destructive"
      });
    }

    setIsShuffling(true);
    try {
      const res = await shuffleStudentsAction(selectedClassesForShuffle);
      if (res.success) {
        toast({
          title: "Pengacakan Berhasil!",
          description: `${res.data.total} siswa telah didistribusikan ke ${selectedClassesForShuffle.length} kelas.`,
          variant: "success"
        });
        setIsShuffleModalOpen(false);
        setSelectedClassesForShuffle([]);
      } else {
        toast({
          title: "Gagal Mengacak",
          description: res.error,
          variant: "destructive"
        });
      }
    } catch (error) {
       toast({
         title: "Kesalahan Sistem",
         description: "Terjadi kesalahan saat memproses pengacakan.",
         variant: "destructive"
       });
    } finally {
      setIsShuffling(false);
    }
  };

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

    try {
      const res = editingKelas 
        ? await updateKelasAction(editingKelas.id, data)
        : await createKelasAction(data);

      if (res.success) {
        toast({
          title: "Berhasil!",
          description: "Data kelas telah berhasil disimpan ke database.",
          variant: "success",
        });
        setIsModalOpen(false);
        setEditingKelas(null);
      } else {
        toast({
          title: "Gagal Menyimpan",
          description: res.error || "Terjadi kesalahan pada server.",
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
      const res = await deleteKelasAction(kelasToDelete);
      if (res.success) {
        toast({
          title: "Kelas Dihapus",
          description: "Data kelas telah berhasil dihapus dari sistem.",
          variant: "success",
        });
        setIsConfirmOpen(false);
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error || "Terjadi kesalahan saat menghapus kelas.",
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white">
                 <School size={28} />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">Data Rombongan Belajar</h1>
                 <div className="text-[11px] text-ink-3 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <div className="w-2 h-0.5 bg-indigo/40" /> Manajemen Kelas & Wali
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsShuffleModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-indigo/5 border border-indigo/20 text-indigo rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo hover:text-white transition-all group"
              >
                <Shuffle className="group-hover:rotate-180 transition-transform duration-500" size={18} strokeWidth={3} /> Acak Siswa Baru
              </button>
              <button 
                onClick={() => { setEditingKelas(null); setIsModalOpen(true); }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-indigo to-indigo-hover text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10 cursor-pointer group"
              >
                <Plus className="group-hover:rotate-90 transition-transform" size={18} strokeWidth={3} /> Tambah Kelas Baru
              </button>
           </div>
        </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative group flex-1">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="CARI NAMA KELAS..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-7 py-4 bg-surface border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div className="flex bg-surface p-1 rounded-2xl border border-border w-fit shadow-inner">
               <button 
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === "grid" ? "bg-indigo text-white" : "text-ink-3 hover:text-ink"
                )}
               >
                 <LayoutGrid size={16} /> Grid
               </button>
               <button 
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === "table" ? "bg-indigo text-white" : "text-ink-3 hover:text-ink"
                )}
               >
                 <List size={16} /> Tabel
               </button>
            </div>
          </div>


        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((k) => (
              <div key={k.id} className="bg-surface border border-border rounded-[40px] p-8 shadow-card hover:shadow-2xl hover:shadow-indigo/5 transition-all group relative overflow-hidden">
                 <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                 
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo group-hover:bg-indigo group-hover:text-white transition-all duration-300">
                       <School size={28} strokeWidth={2} />
                    </div>
                    <div className="flex gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        <Link href={`/dashboard/admin/kelas/${k.id}`} className="w-11 h-11 flex items-center justify-center bg-white/90 border border-border rounded-2xl text-ink-3 hover:text-indigo hover:border-indigo/20 backdrop-blur-sm transition-all cursor-pointer"><Eye size={18} /></Link>
                        <button onClick={() => { setEditingKelas(k); setIsModalOpen(true); }} className="w-11 h-11 flex items-center justify-center bg-white/90 border border-border rounded-2xl text-ink-3 hover:text-indigo hover:border-indigo/20 backdrop-blur-sm transition-all cursor-pointer"><Edit size={18} /></button>
                        <button onClick={() => openDeleteConfirm(k.id)} className="w-11 h-11 flex items-center justify-center bg-white/90 border border-border rounded-2xl text-ink-3 hover:text-red-500 hover:border-red-100 backdrop-blur-sm transition-all cursor-pointer"><Trash2 size={18} /></button>
                     </div>
                 </div>

                 <div>
                    <h3 className="text-2xl font-black text-ink tracking-tight uppercase leading-none mb-2">{k.nama}</h3>
                    <p className="text-[10px] font-black text-indigo uppercase tracking-[0.2em] mb-6">Tingkat {k.tingkat}</p>
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

                 <Link href={`/dashboard/admin/kelas/${k.id}`} className="w-full mt-6 py-4 border border-border rounded-2xl text-[10px] font-black text-ink-3 uppercase tracking-widest hover:bg-cream transition-all flex items-center justify-center gap-2 cursor-pointer">Lihat Detail <ChevronRight size={14} /></Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-[40px] overflow-hidden shadow-card p-2 animate-fadeIn">
            <div className="overflow-x-auto rounded-[32px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/40">
                  <tr>
                    <th className="px-8 py-5 w-[10px]">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                        checked={selectedKelasIds.length === filteredData.length && filteredData.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama Kelas</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Tingkat</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Wali Kelas</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Total Siswa</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredData.map((k) => (
                    <tr key={k.id} className={cn(
                        "hover:bg-cream/20 transition-all group",
                        selectedKelasIds.includes(k.id) ? "bg-indigo-50/30" : ""
                    )}>
                      <td className="px-8 py-5">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                            checked={selectedKelasIds.includes(k.id)}
                            onChange={() => toggleSelectKelas(k.id)}
                          />
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[13px] font-black text-ink uppercase tracking-tight">{k.nama}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo text-[10px] font-black rounded-lg border border-indigo-100 uppercase tracking-widest">Kelas {k.tingkat}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-ink-2 truncate max-w-[200px]">
                           {k.waliKelas?.user.name || "Belum Ditentukan"}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 font-black text-ink text-sm">
                           <Users size={14} className="text-indigo" />
                           {k._count.students}
                        </div>
                      </td>
                        <td className="px-7 py-4 text-right">
                           <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <Link href={`/dashboard/admin/kelas/${k.id}`} className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-2xl text-ink-3 hover:text-indigo hover:border-indigo/20 transition-all cursor-pointer"><Eye size={16} /></Link>
                              <button onClick={() => { setEditingKelas(k); setIsModalOpen(true); }} className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-2xl text-ink-3 hover:text-indigo hover:border-indigo/20 transition-all cursor-pointer"><Edit size={16} /></button>
                              <button onClick={() => openDeleteConfirm(k.id)} className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-2xl text-ink-3 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer"><Trash2 size={16} /></button>
                           </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="py-20 text-center bg-surface border border-dashed border-border rounded-[40px]">
             <School size={48} className="mx-auto text-ink-3/20 mb-4" />
             <p className="text-sm font-black text-ink-3 uppercase tracking-widest">Tidak Ada Kelas Ditemukan</p>
          </div>
        )}
      </div>

      {/* FLOATING ACTION BAR FOR BULK DELETE */}
      {selectedKelasIds.length > 0 && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[101] animate-slideUp">
            <div className="flex items-center gap-8 px-10 py-5 bg-ink text-white rounded-[32px] border border-white/10 backdrop-blur-xl">
               <div className="flex flex-col">
                  <span className="text-[13px] font-black tracking-tight">{selectedKelasIds.length} Rombel Terpilih</span>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Aksi Massal Tersedia</p>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedKelasIds([])}
                    className="px-6 py-2.5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="px-8 py-2.5 bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                  >
                    {isDeleting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
                    Hapus Permanen
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-md rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="p-10 border-b border-border bg-indigo-50/30 flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/5">
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
                  <input type="text" name="nama" defaultValue={editingKelas?.nama} placeholder="CONTOH: X RPL 1" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase tracking-tight focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all", formErrors.nama ? "border-red-500 bg-red-50/10" : "border-border")} />
                  {formErrors.nama && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.nama}</p>}
               </div>

               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Tingkat Pendidikan</label>
                  <select name="tingkat" defaultValue={editingKelas?.tingkat || "7"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                     <option value="7">TINGKAT 7 (TUJUH)</option>
                     <option value="8">TINGKAT 8 (DELAPAN)</option>
                     <option value="9">TINGKAT 9 (SEMBILAN)</option>
                  </select>
               </div>

               <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Wali Kelas Terdaftar</label>
                  <select name="waliKelasId" defaultValue={editingKelas?.waliKelasId || ""} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                     <option value="">BELUM DITENTUKAN</option>
                     {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                  </select>
               </div>

               <button type="submit" className="w-full mt-4 py-4.5 bg-indigo text-white rounded-2xl text-[11px] font-black hover:bg-indigo-hover transition-all uppercase tracking-widest border border-white/10">Simpan Kelas</button>
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

      {/* SMART SHUFFLE MODAL */}
      {isShuffleModalOpen && (
        <div className="fixed inset-0 z-101 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsShuffleModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-lg rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
             <div className="p-8 border-b border-border bg-indigo-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo text-white flex items-center justify-center">
                      <Shuffle size={20} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-ink uppercase tracking-tight leading-none">Smart Shuffle</h3>
                      <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mt-2">Otomatisasi Pembagian Kelas</p>
                   </div>
                </div>
                <button onClick={() => setIsShuffleModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border border-border rounded-full text-ink-3 hover:text-ink"><X size={16} /></button>
             </div>

             <div className="p-10 flex flex-col gap-8">
                <div className="p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-3xl">
                   <p className="text-[11px] text-ink-2 font-bold leading-relaxed">
                     Sistem akan mengambil <span className="text-indigo font-black">SEMUA SISWA</span> yang saat ini belum memiliki kelas (Status: Menganggur) dan membagi mereka secara merata ke dalam kelas-kelas yang Anda centang di bawah ini.
                   </p>
                </div>

                <div className="flex flex-col gap-4">
                   <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest ml-2">Pilih Kelas Tujuan:</label>
                   <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 custom-scrollbar">
                      {kelas.map((k) => (
                        <button
                          key={k.id}
                          onClick={() => {
                            if (selectedClassesForShuffle.includes(k.id)) {
                              setSelectedClassesForShuffle(prev => prev.filter(id => id !== k.id));
                            } else {
                              setSelectedClassesForShuffle(prev => [...prev, k.id]);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left",
                            selectedClassesForShuffle.includes(k.id) 
                              ? "bg-indigo border-indigo text-white" 
                              : "bg-cream/20 border-border text-ink-3 hover:border-indigo/30"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded-md border flex items-center justify-center",
                            selectedClassesForShuffle.includes(k.id) ? "bg-white border-white text-indigo" : "bg-white border-border"
                          )}>
                            {selectedClassesForShuffle.includes(k.id) && <div className="w-2 h-2 bg-indigo rounded-sm" />}
                          </div>
                          <span className="text-[11px] font-black uppercase truncate">{k.nama}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                   <button 
                     onClick={handleShuffle}
                     disabled={isShuffling || selectedClassesForShuffle.length === 0}
                     className="w-full py-4.5 bg-indigo text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-hover transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
                   >
                     {isShuffling ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shuffle size={16} strokeWidth={3} />}
                     {isShuffling ? "SEDANG MENGACAK..." : `ACAK KE ${selectedClassesForShuffle.length} KELAS`}
                   </button>
                   <p className="text-[9px] text-center text-ink-3 font-bold uppercase tracking-widest opacity-40">Tindakan ini akan mengupdate database siswa secara massal</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
