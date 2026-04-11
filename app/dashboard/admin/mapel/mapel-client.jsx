"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { createMapelAction, updateMapelAction, deleteMapelAction, bulkDeleteMapelAction } from "@/lib/actions/mapel-actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  X, 
  Loader2, 
  BookOpen, 
  Users,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookMarked
} from "lucide-react";

export default function MapelClient({ initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({});

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [mapelToDelete, setMapelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination State (Following 'Kelola Siswa' pattern)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    nama: "",
    kode: "",
    kategori: "umum"
  });

  const [selectedMapelIds, setSelectedMapelIds] = useState([]);

  const toggleSelectMapel = (id) => {
    setSelectedMapelIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMapelIds.length === paginatedData.length) {
      setSelectedMapelIds([]);
    } else {
      setSelectedMapelIds(paginatedData.map(m => m.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMapelIds.length === 0) return;
    
    if (!confirm(`Hapus ${selectedMapelIds.length} mata pelajaran terpilih secara permanen?`)) return;

    setIsDeleting(true);
    try {
      const res = await bulkDeleteMapelAction(selectedMapelIds);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: `${selectedMapelIds.length} data mata pelajaran telah dihapus.`,
          variant: "success",
        });
        setSelectedMapelIds([]);
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

  const categories = [
    "Semua Kategori",
    "umum",
    "agama",
    "kejuruan"
  ];

  const kategoriColors = {
    "umum": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "agama": "bg-blue-100 text-blue-800 border-blue-200",
    "kejuruan": "bg-purple-100 text-purple-800 border-purple-200",
  };

  // Logic Filtering (FIXED: Separating Search and Category)
  const filteredData = useMemo(() => {
    setCurrentPage(1); // Reset pagination on filter
    return data.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.kode && item.kode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === "Semua Kategori" || item.kategori === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [data, searchTerm, selectedCategory]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const resetForm = () => {
    setFormData({ nama: "", kode: "", kategori: "umum" });
    setEditingId(null);
    setFormErrors({});
  };

  const handleEdit = (item) => {
    setFormData({ nama: item.nama, kode: item.kode || "", kategori: item.kategori || "umum" });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!formData.nama) {
      setFormErrors({ nama: "Nama mata pelajaran wajib diisi" });
      toast({
        title: "Gagal Menyimpan",
        description: "Nama mata pelajaran tidak boleh kosong.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = editingId 
        ? await updateMapelAction(editingId, formData)
        : await createMapelAction(formData);

      if (res.success) {
        toast({
          title: "Berhasil!",
          description: editingId ? "Data mata pelajaran telah diperbarui." : "Mata pelajaran baru telah ditambahkan.",
          variant: "success",
        });
        setIsModalOpen(false);
        resetForm();
      } else {
        toast({
          title: "Gagal Menyimpan",
          description: res.error || "Terjadi kesalahan pada server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan Koneksi",
        description: "Tidak dapat terhubung ke server.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!mapelToDelete) return;

    try {
      const res = await deleteMapelAction(mapelToDelete);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: "Mata pelajaran telah dihapus dari sistem.",
          variant: "success",
        });
        setIsConfirmOpen(false);
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error || "Terjadi kesalahan pada server.",
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
      setIsLoading(false);
      setIsDeleting(false);
      setMapelToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const openDeleteConfirm = (id, count) => {
    if (count > 0) {
      toast({
        title: "Tidak Dapat Menghapus",
        description: "Mata pelajaran ini masih memiliki jadwal pengampu aktif.",
        variant: "destructive",
      });
      return;
    }
    setMapelToDelete(id);
    setIsConfirmOpen(true);
  };

  return (
    <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
      
      {/* Header Section (Following 'Kelola Siswa' pattern) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-3xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-xl shadow-indigo/20">
                 <BookMarked size={28} />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">Manajemen Mata Pelajaran</h1>
                  <div className="text-[11px] text-ink-3 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                     <div className="w-2 h-0.5 bg-indigo/40" /> Kurikulum & Akademik Jamil
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-indigo to-indigo-hover text-white rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo/30 transition-all border border-white/10 cursor-pointer group"
              >
                <Plus className="group-hover:rotate-90 transition-transform" size={18} strokeWidth={3} /> Tambah Mata Pelajaran
              </button>
           </div>
        </div>

      {/* Filter & Toolbar Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
            <input 
              type="text" 
              placeholder="Cari Nama Mapel atau Kode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-surface border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-2xl text-sm text-ink-2">
            <Filter size={16} className="text-ink-3" />
            <select 
              className="bg-transparent outline-none cursor-pointer font-bold"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Tab categories style (as seen in Siswa page for classes) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {categories.slice(1).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "Semua Kategori" : cat)}
              className={`px-5 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? "bg-indigo text-white border-indigo shadow-md shadow-indigo/20 scale-105" 
                : "bg-surface border-border text-ink-3 hover:border-indigo/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cream/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 w-[10px]">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                    checked={selectedMapelIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">No</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">Mata Pelajaran</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3 text-center">Kategori</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3 text-center">Pengampu</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <tr key={item.id} className={cn(
                    "hover:bg-cream/30 transition-colors group",
                    selectedMapelIds.includes(item.id) ? "bg-indigo-50/30" : ""
                  )}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                        checked={selectedMapelIds.includes(item.id)}
                        onChange={() => toggleSelectMapel(item.id)}
                      />
                    </td>
                    <td className="px-5 py-4 text-[13px] text-ink-3 font-bold">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo shrink-0 group-hover:bg-indigo group-hover:text-white transition-all">
                          <BookMarked size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                           <p className="text-[14px] font-bold text-ink group-hover:text-indigo transition-colors leading-tight">{item.nama}</p>
                           <p className="text-[10px] font-mono text-ink-3 mt-0.5 tracking-widest uppercase">{item.kode || "No Code"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${kategoriColors[item.kategori] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                         {item.kategori || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-light/30 border border-indigo/5 text-[12px] font-bold text-indigo">
                         <Users size={14} />
                         <span>{item._count.pengampu} <span className="font-medium text-ink-3">Pengampu</span></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(item)} className="p-2 text-ink-3 hover:text-indigo hover:bg-indigo-light rounded-lg transition-all"><Edit size={16} /></button>
                        <button onClick={() => openDeleteConfirm(item.id, item._count.pengampu)} className="p-2 text-ink-3 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <Search size={24} className="mx-auto text-ink-3 mb-2 opacity-50" />
                    <p className="text-sm font-medium text-ink-2">Tidak ada data mata pelajaran ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section (Same as Siswa page) */}
        <div className="px-6 py-4 border-t border-border bg-cream/30 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[11px] text-ink-3 font-bold uppercase tracking-widest">
            Showing <span className="text-ink-2">{paginatedData.length}</span> of <span className="text-ink-2">{filteredData.length}</span>
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-1 px-2 border border-border rounded-lg bg-surface text-ink-3 hover:bg-cream disabled:opacity-30"><ChevronLeft size={16} /></button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`min-w-[32px] h-8 text-[11px] font-black rounded-lg transition-all ${currentPage === i + 1 ? "bg-indigo text-white shadow-md shadow-indigo/20 scale-105" : "bg-surface border border-border text-ink-3"}`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-1 px-2 border border-border rounded-lg bg-surface text-ink-3 hover:bg-cream disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BAR FOR BULK DELETE */}
      {selectedMapelIds.length > 0 && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1001] animate-slideUp">
            <div className="flex items-center gap-8 px-10 py-5 bg-ink text-white rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-xl">
               <div className="flex flex-col">
                  <span className="text-[13px] font-black tracking-tight">{selectedMapelIds.length} Mata Pelajaran Terpilih</span>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Aksi Massal Tersedia</p>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedMapelIds([])}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="px-8 py-2.5 bg-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                  >
                    {isDeleting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
                    Hapus Permanen
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Modal - Redesigned to match 'Kelola Siswa' style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp">
            
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-cream/30">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center border",
                  editingId 
                    ? "bg-amber-100 text-amber-600 border-amber-200" 
                    : "bg-indigo/10 text-indigo border-indigo/5"
                )}>
                  {editingId ? <Edit size={22} /> : <Plus size={22} />}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-ink leading-none">
                    {editingId ? "Perbarui Mata Pelajaran" : "Tambah Mata Pelajaran Baru"}
                  </h2>
                  <p className="text-[9px] text-ink-3 mt-1.5 font-bold uppercase tracking-widest">
                    {editingId ? "Pastikan data sudah benar sebelum disimpan" : "Lengkapi informasi kurikulum di bawah"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-cream rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Nama Lengkap Mata Pelajaran</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Matematika" 
                  className={cn("px-5 py-3.5 bg-cream/50 border rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-indigo/10 outline-none transition-all", formErrors.nama ? "border-red-500 bg-red-50/10" : "border-border")}
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
                {formErrors.nama && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest ml-1 animate-shake">{formErrors.nama}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Kode Mapel</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: MTK-1" 
                    readOnly={!!editingId}
                    className={cn(
                      "px-5 py-3.5 border rounded-xl text-[13px] font-mono font-bold transition-all",
                      editingId 
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed" 
                        : "bg-cream/50 border-border focus:ring-4 focus:ring-indigo/10"
                    )}
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  />
                  {editingId && <p className="text-[9px] text-amber-600 font-bold mt-1 ml-1 opacity-70 italic">* Kode tidak dapat diubah setelah dibuat</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Kelompok Kurikulum</label>
                  <select 
                    className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  >
                    <option value="umum">Umum</option>
                    <option value="agama">Agama</option>
                    <option value="kejuruan">Kejuruan</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3.5 border border-border rounded-2xl text-[10px] font-bold text-ink-3 hover:bg-cream transition-all uppercase tracking-widest"
                >
                  Batal
                </button>
                  <button 
                  type="submit" 
                  disabled={isLoading}
                  className={cn(
                    "flex-1 py-3.5 text-white rounded-2xl text-[10px] font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest",
                    editingId 
                      ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" 
                      : "bg-indigo hover:bg-indigo-hover shadow-indigo/20"
                  )}
                >
                  {isLoading && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? "Simpan Perubahan" : "Simpan Mata Pelajaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Status Notification (Following 'Kelola Siswa' aesthetic) */}
      {isLoading && (
        <div className="fixed bottom-10 right-10 z-60 bg-ink text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-white/10">
           <Loader2 size={18} className="animate-spin text-indigo" />
           <p className="text-[12px] font-bold tracking-widest uppercase">Processing...</p>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
      
      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Mata Pelajaran?"
        message="Mata pelajaran ini akan dihapus permanen. Lanjutkan?"
        confirmText="Ya, Hapus Mapel"
      />
    </div>
  );
}
