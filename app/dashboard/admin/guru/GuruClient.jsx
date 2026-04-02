"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { createGuruAction, updateGuruAction, deleteGuruAction } from "@/lib/actions/guru-actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  Download, 
  ChevronLeft,
  ChevronRight,
  User,
  Eye,
  X,
  FileText,
  BadgeCheck,
  Calendar,
  Contact2,
  Check,
  MapPin,
  GraduationCap,
  Users,
  Phone,
  Mail,
  Info,
  Briefcase,
  UserRoundCheck
} from "lucide-react";

const badge = (status) => {
  const isPns = status === "PNS";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
      isPns ? "bg-indigo-100 text-indigo-800 border border-indigo-200" : "bg-indigo-100 text-indigo-800 border border-indigo-200"
    }`}>
      {status}
    </span>
  );
};

export default function GuruClient({ initialTeachers, mapelList }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMapelId, setSelectedMapelId] = useState("all");
  const router = useRouter();
  const [teachers, setTeachers] = useState(initialTeachers);

  useEffect(() => {
    setTeachers(initialTeachers);
  }, [initialTeachers]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({});

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredTeachers = useMemo(() => {
    setCurrentPage(1);
    return teachers.filter(t => {
      const name = t.nama?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      const matchSearch = name.includes(search) || (t.nip || "").includes(searchTerm);
      const matchMapel = selectedMapelId === "all" || t.mapelId === selectedMapelId;
      return matchSearch && matchMapel;
    });
  }, [teachers, searchTerm, selectedMapelId]);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteGuruAction(teacherToDelete);
      if (res.success) {
        toast({
          title: "Data Dihapus",
          description: "Profil guru telah berhasil dihapus dari sistem.",
          variant: "success",
        });
        setIsConfirmOpen(false);
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error || "Terjadi kesalahan saat menghapus data.",
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
      setTeacherToDelete(null);
    }
  };

  const openDeleteConfirm = (id) => {
    setTeacherToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleNext = () => {
    setFormErrors({});
    if (currentStep === 1) {
       const nama = document.querySelector('input[name="nama"]')?.value;
       const nip = document.querySelector('input[name="nip"]')?.value;
       
       let errors = {};
       if (!nama) errors.nama = "Nama lengkap wajib diisi";
       if (!nip) errors.nip = "NIP atau identitas wajib diisi";

       if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          toast({
            title: "Data Belum Lengkap",
            description: "Mohon lengkapi kolom Nama dan NIP.",
            variant: "destructive",
          });
          return;
       }
    }
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const finalCheck = () => {
    const nama = document.querySelector('input[name="nama"]')?.value;
    if (!nama) {
       toast({
         title: "Kesalahan Validasi",
         description: "Nama Guru tidak boleh kosong.",
         variant: "destructive",
       });
       return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (currentStep !== totalSteps) return;
    if (!finalCheck()) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = editingTeacher 
        ? await updateGuruAction(editingTeacher.id, data)
        : await createGuruAction(data);

      if (res.success) {
        toast({
          title: "Berhasil!",
          description: editingTeacher ? "Profil guru telah diperbarui." : "Registrasi guru berhasil dilakukan.",
          variant: "success",
        });
        setIsModalOpen(false);
        setEditingTeacher(null);
        setCurrentStep(1);
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

  const openModal = (guru = null) => {
    setEditingTeacher(guru);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-3xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-xl shadow-indigo/20">
                 <UserRoundCheck size={28} />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">Data Pengajar</h1>
                 <div className="text-[11px] text-ink-3 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <div className="w-2 h-0.5 bg-indigo/40" /> Manajemen Guru & Staff Akademik
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-indigo to-indigo-hover text-white rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo/30 transition-all border border-white/10 cursor-pointer group"
              >
                <Plus className="group-hover:rotate-90 transition-transform" size={18} strokeWidth={3} /> Registrasi Guru
              </button>
           </div>
        </div>

          <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
                <input 
                  type="text" 
                  placeholder="CARI NAMA ATAU NIP..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-7 py-4 bg-surface border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-3 px-5 py-3.5 bg-surface border border-border rounded-2xl text-[11px] text-ink-2 font-black uppercase tracking-widest shadow-sm">
                <Filter size={16} className="text-ink-3" strokeWidth={2.5} />
                <select 
                  className="bg-transparent outline-none cursor-pointer min-w-[140px]"
                  value={selectedMapelId}
                  onChange={(e) => setSelectedMapelId(e.target.value)}
                >
                  <option value="all">SEMUA MAPEL</option>
                  {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                </select>
              </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[40px] overflow-hidden shadow-card p-2">
            <div className="overflow-x-auto rounded-[32px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/40">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Rank</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama & NIP</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Spesialisasi</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Kepegawaian</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {paginatedTeachers.map((guru, idx) => (
                    <tr key={guru.id} className="hover:bg-cream/20 transition-all group">
                      <td className="px-8 py-5 text-[13px] text-ink-3 font-black opacity-30">
                        {String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-light border border-indigo-light flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-all text-xs font-black shadow-inner">
                            {guru.nama?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[14px] font-black text-ink uppercase tracking-tight">{guru.nama}</span>
                             <span className="text-[10px] font-bold text-ink-3 tracking-widest">{guru.nip || "NON-NIP"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-xl border border-indigo-100 uppercase tracking-widest">
                          {guru.mapel}
                        </span>
                      </td>
                      <td className="px-8 py-5">{badge(guru.status)}</td>
                      <td className="px-8 py-5 text-right space-x-2">
                         <button onClick={() => setViewingTeacher(guru)} className="w-9 h-9 inline-flex items-center justify-center bg-indigo-light text-teal border border-indigo-light hover:bg-teal hover:text-white rounded-xl transition-all shadow-sm"><Eye size={16} strokeWidth={2.5}/></button>
                         <button onClick={() => openModal(guru)} className="w-9 h-9 inline-flex items-center justify-center bg-indigo-50 text-indigo border border-indigo-100 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} strokeWidth={2.5}/></button>
                         <button onClick={() => openDeleteConfirm(guru.id)} className="w-9 h-9 inline-flex items-center justify-center bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} strokeWidth={2.5}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {/* VIEW MODAL (PREMIUM) */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-10">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-xl" onClick={() => setViewingTeacher(null)} />
          <div className="relative bg-surface w-full max-w-2xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="h-40 bg-linear-to-br from-indigo to-teal-700 relative shrink-0">
               <button onClick={() => setViewingTeacher(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-20 border border-white/10">
                  <X size={20} strokeWidth={2.5}/>
               </button>
               <div className="absolute -bottom-14 left-12 group">
                  <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                     <div className="w-full h-full rounded-[34px] bg-indigo-light flex items-center justify-center text-teal shadow-inner border border-teal/5 relative overflow-hidden">
                        <User size={56} strokeWidth={1} className="relative z-10" />
                        <div className="absolute inset-0 bg-linear-to-tr from-teal/10 to-transparent" />
                     </div>
                  </div>
               </div>
            </div>
            <div className="pt-16 pb-12 px-12 overflow-y-auto">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <h2 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">{viewingTeacher.nama}</h2>
                     <div className="flex items-center gap-4 mt-4 font-black uppercase tracking-[0.2em] text-[10px] text-teal/60">
                        <GraduationCap size={12} strokeWidth={2.5} />
                        <span>SPESIALIS {viewingTeacher.mapel}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                        {badge(viewingTeacher.status)}
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <p className="px-3 py-1 bg-cream border border-border rounded-lg text-[9px] font-black text-ink-3 uppercase tracking-widest mb-2 shadow-sm">Indentitas: NIP</p>
                     <p className="text-2xl font-black text-ink leading-none font-mono tracking-tighter">{viewingTeacher.nip || "NON-ASN"}</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 text-teal">
                        <Info size={18} strokeWidth={2.5} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Informasi Pribadi</span>
                     </div>
                     <div className="space-y-4 bg-cream/30 p-6 rounded-[32px] border border-border/50">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-60">NIK Pendududk</span>
                           <span className="text-[14px] font-black text-ink font-mono">{viewingTeacher.nik || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-60">Email Instansi</span>
                           <span className="text-[14px] font-black text-ink lowercase">{viewingTeacher.username}</span>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 text-indigo">
                        <Phone size={18} strokeWidth={2.5} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Kontak & Alamat</span>
                     </div>
                     <div className="space-y-4 bg-indigo-50/20 p-6 rounded-[32px] border border-indigo-light/30">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-indigo/60 uppercase tracking-widest">WhatsApp</span>
                           <span className="text-[14px] font-black text-ink">{viewingTeacher.noHp || "-"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-indigo/60 uppercase tracking-widest">Domisili</span>
                           <span className="text-[12px] font-bold text-ink uppercase tracking-tight">{viewingTeacher.alamat || "-"}</span>
                        </div>
                     </div>
                  </div>
               </div>
               <button onClick={() => { setEditingTeacher(viewingTeacher); setViewingTeacher(null); setIsModalOpen(true); }} className="w-full py-4.5 bg-indigo text-white rounded-3xl text-[11px] font-black shadow-2xl shadow-indigo/30 flex items-center justify-center gap-3 hover:bg-indigo-hover hover:-translate-y-1 transition-all uppercase tracking-widest border border-white/10 active:scale-95">Edit Profil Guru</button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (WIZARD) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-10">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-lg rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="p-10 border-b border-border bg-indigo-light/30 flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[22px] bg-indigo/10 flex items-center justify-center text-indigo-hover border border-indigo/5 shadow-inner">
                     <Contact2 size={24} strokeWidth={3} />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-ink uppercase tracking-tight leading-none">{editingTeacher ? "Update Profil" : "Registrasi Guru"}</h2>
                     <p className="text-[10px] font-black text-ink-3 mt-3 uppercase tracking-widest opacity-60">Step {currentStep} of 2</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-ink-3 hover:text-ink"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-10 flex flex-col gap-6">
               {/* STEP 1: PERSONAL */}
               <div className={currentStep !== 1 ? "hidden" : "flex flex-col gap-6"}>
                  <div className="flex flex-col gap-2.5">
                     <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Nama Lengkap Guru</label>
                     <input type="text" name="nama" defaultValue={editingTeacher?.nama}  className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase tracking-tight outline-none", formErrors.nama ? "border-red-500 bg-red-50/10" : "border-border")} />
                     {formErrors.nama && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.nama}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">NIP (Identitas)</label>
                        <input type="text" name="nip" defaultValue={editingTeacher?.nip} className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black outline-none", formErrors.nip ? "border-red-500 bg-red-50/10" : "border-border")} />
                        {formErrors.nip && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.nip}</p>}
                     </div>
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Keahlian (Mapel)</label>
                        <select name="mapelId" defaultValue={editingTeacher?.mapelId || ""} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none">
                           <option value="">PILIH MAPEL</option>
                           {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               {/* STEP 2: DETAILS */}
               <div className={currentStep !== 2 ? "hidden" : "flex flex-col gap-6"}>
                  <div className="grid grid-cols-2 gap-5">
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Status Guru</label>
                        <select name="status" defaultValue={editingTeacher?.status || "GTT"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none">
                           <option value="PNS">ASN / PNS</option>
                           <option value="GTT">GURU TETAP (GTT)</option>
                           <option value="Honor">TENAGA HONORER</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">No WhatsApp</label>
                        <input type="text" name="noHp" defaultValue={editingTeacher?.noHp} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-black outline-none" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                     <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Alamat Lengkap</label>
                     <input type="text" name="alamat" defaultValue={editingTeacher?.alamat} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-black uppercase outline-none" />
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                     <button key="guru-btn-back" type="button" onClick={() => setCurrentStep(1)} className="flex-1 py-4.5 border border-border rounded-3xl text-[11px] font-black text-ink-3 hover:bg-cream transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50" disabled={isSaving}>Kembali</button>
                  )}
                  {currentStep < totalSteps ? (
                     <button key="guru-btn-next" type="button" onClick={handleNext} className="flex-2 py-4.5 bg-indigo text-white rounded-3xl text-[11px] font-black shadow-xl shadow-indigo/20 hover:bg-indigo-hover transition-all uppercase tracking-widest border border-white/10 active:scale-95">
                        Langkah Berikutnya
                     </button>
                  ) : (
                     <button key="guru-btn-submit" type="submit" className="flex-2 py-4.5 bg-indigo-hover text-white rounded-3xl text-[11px] font-black shadow-xl shadow-indigo-hover/20 hover:bg-teal-700 transition-all uppercase tracking-widest border border-white/10 active:scale-95 disabled:bg-indigo-hover/50" disabled={isSaving}>
                        {isSaving ? "Sedang Menyimpan..." : "Simpan Guru"}
                     </button>
                  )}
               </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0EA5A0; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Data Guru?"
        message="Menghapus data ini akan menghilangkan akses guru tersebut ke dashboard dan menghapus seluruh riwayat mengajar yang tertaut. Lanjutkan?"
        confirmText="Ya, Hapus Guru"
      />
    </>
  );
}
