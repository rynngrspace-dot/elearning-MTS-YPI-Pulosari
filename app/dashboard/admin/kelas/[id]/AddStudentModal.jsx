"use client";

import { useState, useMemo } from "react";
import { 
  UserPlus, 
  X, 
  Search, 
  User as UserIcon,
  CheckCircle2,
  Loader2,
  Check,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bulkAssignToKelasAction } from "@/lib/actions/siswa-actions";

export default function AddStudentModal({ isOpen, onClose, unassignedStudents, kelasId, kelasNama }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    return unassignedStudents.filter(s => 
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm)
    );
  }, [unassignedStudents, searchTerm]);

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleBulkAssign = async () => {
    if (selectedIds.size === 0) return;
    setIsAssigning(true);
    try {
      const res = await bulkAssignToKelasAction(Array.from(selectedIds), kelasId);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: `${selectedIds.size} siswa telah ditambahkan ke kelas ${kelasNama}.`,
          variant: "success",
        });
        setSelectedIds(new Set());
        onClose();
      } else {
        toast({
          title: "Gagal Menambahkan",
          description: res.error || "Terjadi kesalahan pada server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Tidak dapat menghubungi server.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" 
        onClick={onClose} 
      />
      
      <div className="relative bg-surface w-full max-w-xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp max-h-[85vh]">
        {/* HEADER */}
        <div className="p-10 border-b border-border bg-indigo-50/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[22px] bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/5 shadow-inner">
              <UserPlus size={24} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink uppercase tracking-tight leading-none">Tambah Siswa</h2>
              <div className="text-[10px] font-black text-ink-3 mt-3 uppercase tracking-widest opacity-60 flex items-center gap-2">
                <div className="w-2 h-0.5 bg-indigo-500/40" /> Penempatan ke {kelasNama}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-full text-ink-3 hover:text-red-500 transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* SEARCH & SELECT ALL */}
        <div className="p-10 bg-white/50 border-b border-border/50 shrink-0 space-y-6">
          <div className="relative group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="CARI NAMA ATAU NISN SISWA..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-7 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-black uppercase tracking-tight focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:opacity-30"
            />
          </div>

          <div className="flex items-center justify-between px-2">
             <button 
              onClick={toggleSelectAll}
              className="flex items-center gap-3 text-[10px] font-black text-ink-3 uppercase tracking-widest hover:text-indigo-500 transition-colors"
             >
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  selectedIds.size === filteredStudents.length && filteredStudents.length > 0
                    ? "bg-indigo-500 border-indigo-500 text-white" 
                    : "border-border bg-white"
                )}>
                  {selectedIds.size === filteredStudents.length && filteredStudents.length > 0 && <Check size={12} strokeWidth={4} />}
                </div>
                Pilih Semua {filteredStudents.length > 0 && `(${filteredStudents.length})`}
             </button>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {selectedIds.size} Terpilih
             </span>
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-cream/5">
          <div className="grid grid-cols-1 gap-3">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                  <div className={cn(
                    "p-5 bg-surface border rounded-3xl flex items-center justify-between transition-all group cursor-pointer",
                    selectedIds.has(s.id) 
                      ? "border-indigo-500 bg-indigo-50/30 shadow-lg shadow-indigo-500/5" 
                      : "border-border hover:border-indigo-500/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300",
                      selectedIds.has(s.id)
                        ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                        : "bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 shadow-inner"
                    )}>
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-ink uppercase tracking-tight leading-none mb-1.5">{s.nama}</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-[8px] font-black text-indigo-600 border border-indigo-100 rounded uppercase tracking-widest">NISN</span>
                        <p className="text-[11px] font-bold text-ink-3 tabular-nums">{s.nisn}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedIds.has(s.id)
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : "border-border bg-white"
                  )}>
                    {selectedIds.has(s.id) && <Check size={14} strokeWidth={4} />}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-white border border-dashed border-border rounded-full flex items-center justify-center text-ink-3/20 mx-auto mb-6">
                  <UserIcon size={40} />
                </div>
                <p className="text-[13px] font-black text-ink-3 uppercase tracking-widest">Tidak Ada Siswa Tersedia</p>
                <p className="text-[9px] font-black text-ink-3 uppercase tracking-widest mt-3 opacity-40 italic">Semua siswa sudah memiliki kelas</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 border-t border-border bg-white shrink-0">
           <button 
            disabled={selectedIds.size === 0 || isAssigning}
            onClick={handleBulkAssign}
            className={cn(
              "w-full py-4.5 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
              selectedIds.size > 0 
                ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-600" 
                : "bg-cream text-ink-3 border border-border cursor-not-allowed opacity-50"
            )}
           >
             {isAssigning ? (
               <><Loader2 size={18} className="animate-spin" /> Sedang Menambahkan...</>
             ) : (
               <><Plus size={18} strokeWidth={3} /> Tambah {selectedIds.size} Siswa Terpilih</>
             )}
           </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  );
}
