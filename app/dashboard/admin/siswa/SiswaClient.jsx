"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  GraduationCap,
  Users,
  Phone,
  Info,
  Calendar,
  School
} from "lucide-react";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { createSiswaAction, updateSiswaAction, deleteSiswaAction } from "@/lib/actions/siswa-actions";

const badge = (status) => {
  const isAktif = status === "Aktif";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
      isAktif ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
    }`}>
      {status}
    </span>
  );
};

export default function SiswaClient({ initialStudents, kelasList }) {
  const [activeTab, setActiveTab] = useState("Semua Siswa");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("all");
  const router = useRouter();
  const [students, setStudents] = useState(initialStudents);

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
  const [viewingSiswa, setViewingSiswa] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({});

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtering logic
  const filteredStudents = useMemo(() => {
    setCurrentPage(1);
    return students.filter(s => {
      const name = s.nama?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      const matchSearch = name.includes(search) || 
                          (s.nisn || "").includes(searchTerm) ||
                          (s.nis || "").includes(searchTerm);
      const matchClass = selectedClassId === "all" || s.kelasId === selectedClassId;
      return matchSearch && matchClass;
    });
  }, [students, searchTerm, selectedClassId]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteSiswaAction(studentToDelete);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: "Data siswa telah berhasil dihapus dari sistem.",
          variant: "success",
        });
        setIsConfirmOpen(false);
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error || "Gagal menghapus data siswa.",
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
      setStudentToDelete(null);
    }
  };

  const openDeleteConfirm = (id) => {
    setStudentToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (currentStep !== totalSteps) return;
    if (!finalCheck()) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = editingSiswa 
        ? await updateSiswaAction(editingSiswa.id, data)
        : await createSiswaAction(data);

      if (res.success) {
        toast({
          title: "Berhasil!",
          description: editingSiswa ? "Data siswa telah diperbarui." : "Siswa berhasil didaftarkan ke sistem.",
          variant: "success",
        });
        setIsModalOpen(false);
        setEditingSiswa(null);
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

  const openModal = (siswa = null) => {
    setEditingSiswa(siswa);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSiswa(null);
    setCurrentStep(1);
  };

  const handleNext = () => {
    setFormErrors({});
    // Manual Validation per Step (Siswa)
    if (currentStep === 1) {
       const nama = document.querySelector('input[name="nama"]')?.value;
       const tempat = document.querySelector('input[name="tempatLahir"]')?.value;
       const tgl = document.querySelector('input[name="tanggalLahir"]')?.value;
       
       let errors = {};
       if (!nama) errors.nama = "Nama lengkap wajib diisi";
       if (!tempat) errors.tempatLahir = "Tempat lahir wajib diisi";
       if (!tgl) errors.tanggalLahir = "Tanggal lahir wajib diisi";

       if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          toast({
            title: "Data Belum Lengkap",
            description: "Mohon lengkapi seluruh kolom yang wajib diisi.",
            variant: "destructive",
          });
          return;
       }
    }
    if (currentStep === 2) {
       const nisn = document.querySelector('input[name="nisn"]')?.value;
       if (!nisn) {
          setFormErrors({ nisn: "NISN Nasional wajib diisi untuk akun siswa" });
          toast({
            title: "NISN Diperlukan",
            description: "NISN digunakan sebagai identitas utama siswa.",
            variant: "destructive",
          });
          return;
       }

       // Check uniqueness (client-side)
       const isDuplicate = students.some(s => s.nisn === nisn && s.id !== editingSiswa?.id);
       if (isDuplicate) {
          setFormErrors({ nisn: "NISN sudah terdaftar di sistem" });
          toast({
            title: "NISN Duplikat",
            description: "Siswa dengan NISN ini sudah ada dalam database.",
            variant: "destructive",
          });
          return;
       }
    }

    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const finalCheck = () => {
    const nama = document.querySelector('input[name="nama"]')?.value;
    const nisn = document.querySelector('input[name="nisn"]')?.value;
    if (!nama || !nisn) {
       toast({
         title: "Kesalahan Validasi",
         description: "Nama atau NISN masih ada yang kosong. Periksa kembali langkah 1 & 2.",
         variant: "destructive",
       });
       return false;
    }

    const isDuplicate = students.some(s => s.nisn === nisn && s.id !== editingSiswa?.id);
    if (isDuplicate) {
       toast({
         title: "NISN Duplikat",
         description: "Siswa dengan NISN ini sudah ada dalam database.",
         variant: "destructive",
       });
       return false;
    }
    return true;
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-ink tracking-tight uppercase leading-none">Manajemen Siswa</h1>
              <div className="h-1 w-20 bg-indigo mt-3 rounded-full" />
              <p className="text-[11px] text-ink-3 font-bold uppercase tracking-widest mt-4">Database Peserta Didik Aktif</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-6 py-3 border border-border rounded-2xl bg-surface text-ink-2 text-xs font-black hover:bg-cream transition-all uppercase tracking-widest shadow-sm hover:shadow">
                <Download size={14} strokeWidth={2.5} />
                Export CSV
              </button>
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-3 bg-indigo text-white rounded-2xl text-[11px] font-black hover:bg-indigo-hover transition-all shadow-xl shadow-indigo/20 uppercase tracking-widest border border-white/10"
              >
                <Plus size={18} strokeWidth={3} />
                Pendaftaran
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border">
              <div className="flex gap-10">
                {["Semua Siswa", "Filter Lanjutan"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSelectedClassId("all"); }}
                    className={`pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative ${
                      activeTab === tab ? "text-indigo" : "text-ink-3 hover:text-ink-2"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo rounded-full shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
                <input 
                  type="text" 
                  placeholder="CARI NAMA, NISN, ATAU NIS..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-7 py-4 bg-surface border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all placeholder:text-ink-3/40"
                />
              </div>
              
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-3 px-5 py-3.5 bg-surface border border-border rounded-2xl text-[11px] text-ink-2 font-black uppercase tracking-widest shadow-sm">
                    <Filter size={16} className="text-ink-3" strokeWidth={2.5} />
                    <select 
                      className="bg-transparent outline-none cursor-pointer min-w-[140px]"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                      <option value="all">SEMUA KELAS</option>
                      {kelasList.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                    </select>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[40px] overflow-hidden shadow-card p-2 flex flex-col gap-2">
            <div className="overflow-x-auto rounded-[32px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/40 px-6">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">No</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Identitas / NISN</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama Lengkap</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Lokal Kelas</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((siswa, idx) => (
                      <tr key={siswa.id} className="hover:bg-cream/20 transition-all group cursor-default">
                        <td className="px-8 py-5 text-[13px] text-ink font-black">
                          {String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                             <div className="px-2 py-0.5 bg-indigo/5 border border-indigo/10 rounded-md self-start">
                                <span className="text-[11px] font-black text-indigo tracking-tight leading-none">{siswa.nisn}</span>
                             </div>
                             <span className="text-[9px] font-bold text-ink-3 uppercase tracking-tighter opacity-60">NIS: {siswa.nis || "-"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo/5 border border-indigo/10 flex items-center justify-center text-indigo shrink-0 group-hover:bg-indigo group-hover:text-white group-hover:scale-110 transition-all text-xs font-black uppercase shadow-inner">
                              {siswa.nama?.charAt(0)}
                            </div>
                            <span className="text-[14px] font-black text-ink group-hover:text-indigo group-hover:translate-x-1 transition-all uppercase tracking-tight">{siswa.nama}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-cream text-ink-2 text-[10px] font-black rounded-xl border border-border uppercase tracking-widest shadow-sm group-hover:border-indigo/20 group-hover:bg-white transition-colors">
                            {siswa.kelas}
                          </span>
                        </td>
                        <td className="px-8 py-5">{badge(siswa.status)}</td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => setViewingSiswa(siswa)} className="w-9 h-9 flex items-center justify-center bg-teal/5 text-teal border border-teal/10 hover:bg-teal hover:text-white rounded-xl transition-all shadow-sm"><Eye size={16} strokeWidth={2.5}/></button>
                             <button onClick={() => openModal(siswa)} className="w-9 h-9 flex items-center justify-center bg-indigo/5 text-indigo border border-indigo/10 hover:bg-indigo hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} strokeWidth={2.5}/></button>
                             <button onClick={() => openDeleteConfirm(siswa.id)} className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} strokeWidth={2.5}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <div className="w-16 h-16 bg-cream rounded-[24px] flex items-center justify-center mx-auto mb-4 border border-border shadow-inner">
                           <Search size={28} className="text-ink-3/40" strokeWidth={1.5} />
                        </div>
                        <p className="text-[11px] font-black text-ink-3 uppercase tracking-widest">Tidak Ada Data Ditemukan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-5 border-t border-border/30 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5 min-w-0">
                 <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest leading-none">Tampil</p>
                 <span className="text-[13px] font-black text-ink leading-none">{paginatedStudents.length}</span>
                 <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest leading-none">/</p>
                 <span className="text-[10px] font-bold text-ink-3">{filteredStudents.length} Database</span>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center border border-border rounded-xl bg-surface text-ink-3 hover:bg-cream disabled:opacity-20 shadow-sm transition-all"><ChevronLeft size={16} strokeWidth={3}/></button>
                  <div className="flex items-center gap-1.5">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`min-w-[36px] h-9 text-[11px] font-black rounded-xl transition-all ${currentPage === i + 1 ? "bg-indigo text-white shadow-xl shadow-indigo/20 scale-105 border border-white/10" : "bg-surface border border-border text-ink-3 hover:border-indigo/30 shadow-sm"}`}>{i + 1}</button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center border border-border rounded-xl bg-surface text-ink-3 hover:bg-cream disabled:opacity-20 shadow-sm transition-all"><ChevronRight size={16} strokeWidth={3}/></button>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* VIEW MODAL (PREMIUM) */}
      {viewingSiswa && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-xl animate-fadeIn" onClick={() => setViewingSiswa(null)} />
          <div className="relative bg-surface w-full max-w-2xl max-h-[90vh] rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            
            <div className="h-40 bg-linear-to-br from-indigo to-indigo-hover relative shrink-0">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
               <button onClick={() => setViewingSiswa(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-20 backdrop-blur-md border border-white/10">
                  <X size={20} strokeWidth={2.5}/>
               </button>
               <div className="absolute -bottom-14 left-12 group">
                  <div className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                     <div className="w-full h-full rounded-[34px] bg-indigo-light flex items-center justify-center text-indigo shadow-inner border border-indigo/5 relative overflow-hidden">
                        <User size={56} strokeWidth={1} className="relative z-10" />
                        <div className="absolute inset-0 bg-linear-to-tr from-indigo/10 to-transparent" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-16 pb-10 px-12 overflow-y-auto custom-scrollbar">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <h2 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">{viewingSiswa.nama}</h2>
                     <div className="flex items-center gap-4 mt-4 font-black uppercase tracking-[0.2em] text-[10px] text-indigo/60">
                        <School size={12} strokeWidth={2.5} />
                        <span>Kelas {viewingSiswa.kelas}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                        {badge(viewingSiswa.status)}
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <p className="px-3 py-1 bg-cream border border-border rounded-lg text-[9px] font-black text-ink-3 uppercase tracking-widest mb-2 shadow-sm">National ID: NISN</p>
                     <p className="text-2xl font-black text-ink leading-none font-mono tracking-tighter">{viewingSiswa.nisn}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8 flex flex-col">
                     <div className="flex items-center gap-3 text-indigo">
                        <GraduationCap size={20} strokeWidth={2.5} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Academic Profile</span>
                     </div>
                     
                     <div className="space-y-6 bg-cream/30 p-6 rounded-[32px] border border-border/50">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-60">Identification No</span>
                           <span className="text-[15px] font-black text-ink font-mono tracking-tight">{viewingSiswa.nis || "N/A"} <span className="text-ink-3 font-medium opacity-40 mx-2">/</span> {viewingSiswa.nik || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-60">Pob & Dob</span>
                           <span className="text-[14px] font-black text-ink uppercase tracking-tight">{viewingSiswa.tempatLahir || "Unknown"}, {viewingSiswa.tanggalLahir || "-"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-60">Gender Specific</span>
                           <span className="text-[14px] font-black text-ink uppercase tracking-wider">{viewingSiswa.gender === "L" ? "LAKI-LAKI (MALE)" : "PEREMPUAN (FEMALE)"}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 flex flex-col">
                     <div className="flex items-center gap-3 text-teal">
                        <Users size={20} strokeWidth={2.5} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Parents & Contact</span>
                     </div>

                     <div className="space-y-6 bg-teal-light/20 p-6 rounded-[32px] border border-teal-light/30">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-teal/60 uppercase tracking-widest">Wali: Ayah & Ibu</span>
                           <span className="text-[14px] font-black text-ink uppercase tracking-tight truncate">{viewingSiswa.namaAyah} <span className="opacity-30">&</span> {viewingSiswa.namaIbu}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-teal/60 uppercase tracking-widest">Active WhatsApp</span>
                           <div className="flex items-center gap-2">
                              <Phone size={14} className="text-teal" strokeWidth={2.5} />
                              <span className="text-[15px] font-black text-ink font-mono tracking-tight">{viewingSiswa.noHpOrangTua || "-"}</span>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-teal/60 uppercase tracking-widest">Admission Year</span>
                           <span className="text-[14px] font-black text-ink uppercase tracking-widest">{viewingSiswa.tahunMasuk || "2024"} <span className="text-[10px] font-bold text-teal">FRESHMAN</span></span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-12 flex gap-4">
                  <button onClick={() => { setEditingSiswa(viewingSiswa); setViewingSiswa(null); setIsModalOpen(true); }} className="flex-1 py-4.5 bg-indigo text-white rounded-3xl text-[11px] font-black shadow-2xl shadow-indigo/30 flex items-center justify-center gap-3 hover:bg-indigo-hover hover:-translate-y-1 transition-all uppercase tracking-widest border border-white/10 active:scale-95"><Edit size={16} strokeWidth={2.5} /> Update Siswa</button>
                  <button className="px-8 py-4.5 bg-surface border border-border rounded-3xl text-[11px] font-black text-ink-2 hover:bg-cream transition-all uppercase tracking-widest shadow-sm active:scale-95">Download PDF</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (WIZARD) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-101 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={() => closeModal()} />
          <div className="relative bg-surface w-full max-w-lg rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp max-h-[90vh]">
            
            <div className="px-10 py-7 border-b border-border flex items-center justify-between bg-cream/20">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[22px] bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/5 shadow-inner">
                     {editingSiswa ? <Edit size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-ink leading-none uppercase tracking-tight">{editingSiswa ? "Update Biodata" : "Pendaftaran Siswa"}</h2>
                     <p className="text-[10px] font-black text-ink-3 mt-2 uppercase tracking-[0.2em] opacity-60">Step {currentStep} of 3</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  {[1, 2, 3].map(step => (
                     <div key={step} className={`w-2 h-2 rounded-full transition-all duration-500 ${currentStep === step ? "bg-indigo w-8 shadow-xl shadow-indigo/20" : currentStep > step ? "bg-indigo/30" : "bg-border"}`} />
                  ))}
               </div>
            </div>

            <form onSubmit={handleSave} className="p-10 pb-5 overflow-y-auto custom-scrollbar">
               <div className="space-y-8">
                  {/* --- STEP 1: BIODATA --- */}
                  <div className={currentStep !== 1 ? "hidden" : "space-y-6 animate-fadeIn"}>
                     <div className="flex items-center gap-3 text-indigo/40 mb-2">
                        <User size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Biodata Identitas</span>
                     </div>
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Nama Lengkap Siswa</label>
                        <input type="text" name="nama" defaultValue={editingSiswa?.nama} placeholder="CONTOH: AHMAD SUBARDJO" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase tracking-tight focus:ring-4 focus:ring-indigo/10 focus:border-indigo outline-none transition-all placeholder:opacity-20", formErrors.nama ? "border-red-500 bg-red-50/10" : "border-border")} />
                        {formErrors.nama && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.nama}</p>}
                     </div>
                     <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Tempat Lahir</label>
                           <input type="text" name="tempatLahir" defaultValue={editingSiswa?.tempatLahir}  className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase tracking-tight outline-none", formErrors.tempatLahir ? "border-red-500 bg-red-50/10" : "border-border")} />
                           {formErrors.tempatLahir && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.tempatLahir}</p>}
                        </div>
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Tanggal Lahir</label>
                           <input type="date" name="tanggalLahir" defaultValue={editingSiswa?.tanggalLahir}  className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-mono font-black outline-none", formErrors.tanggalLahir ? "border-red-500 bg-red-50/10" : "border-border")} />
                           {formErrors.tanggalLahir && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.tanggalLahir}</p>}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Jenis Kelamin</label>
                           <select name="gender" defaultValue={editingSiswa?.gender || "L"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                              <option value="L">LAKI-LAKI</option>
                              <option value="P">PEREMPUAN</option>
                           </select>
                        </div>
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">NIK (Kependudukan)</label>
                           <input type="text" name="nik" defaultValue={editingSiswa?.nik} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-mono font-black outline-none" />
                        </div>
                     </div>
                  </div>

                  {/* --- STEP 2: AKADEMIK --- */}
                  <div className={currentStep !== 2 ? "hidden" : "space-y-6 animate-fadeIn"}>
                     <div className="flex items-center gap-3 text-indigo/40 mb-2">
                        <GraduationCap size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Akademik</span>
                     </div>
                     <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">NISN NASIONAL</label>
                           <input type="text" name="nisn" defaultValue={editingSiswa?.nisn}  className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-mono font-black tracking-widest outline-none", formErrors.nisn ? "border-red-500 bg-red-50/10" : "border-border")} />
                           {formErrors.nisn && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.nisn}</p>}
                        </div>
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">NIS SEKOLAH</label>
                           <input type="text" name="nis" defaultValue={editingSiswa?.nis} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-mono font-black tracking-widest outline-none" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Penempatan Kelas</label>
                           <select name="kelasId" defaultValue={editingSiswa?.kelasId || ""} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                              <option value="">PILIH KELAS</option>
                              {kelasList.map(c => <option key={c.id} value={c.id}>{c.nama}</option>)}
                           </select>
                        </div>
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Tahun Angkatan</label>
                           <input type="text" name="tahunMasuk" defaultValue={editingSiswa?.tahunMasuk || "2024"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-black text-center outline-none" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Status Database</label>
                        <select name="status" defaultValue={editingSiswa?.status || "Aktif"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer">
                           <option value="Aktif">DATABASE AKTIF</option>
                           <option value="Non-Aktif">ARSIP (NON-AKTIF)</option>
                        </select>
                     </div>
                  </div>

                  {/* --- STEP 3: ORANG TUA --- */}
                  <div className={currentStep !== 3 ? "hidden" : "space-y-6 animate-fadeIn"}>
                     <div className="flex items-center gap-3 text-teal/40 mb-2">
                        <Users size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Relasi & Kontak</span>
                     </div>
                     <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Nama Ayah</label>
                           <input type="text" name="namaAyah" defaultValue={editingSiswa?.namaAyah} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-black uppercase outline-none" />
                        </div>
                        <div className="flex flex-col gap-2.5">
                           <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">Nama Ibu</label>
                           <input type="text" name="namaIbu" defaultValue={editingSiswa?.namaIbu} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-black uppercase outline-none" />
                        </div>
                     </div>
                     <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest opacity-70">No WhatsApp Aktif</label>
                        <div className="relative">
                           <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30">
                              <Phone size={14} strokeWidth={2.5}/>
                              <div className="w-px h-4 bg-ink" />
                           </div>
                           <input type="text" name="noHpOrangTua" defaultValue={editingSiswa?.noHpOrangTua} placeholder="CONTOH: 08123456789" className="w-full pl-16 pr-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[13px] font-mono font-black tracking-widest outline-none" />
                        </div>
                     </div>
                     <div className="p-6 bg-indigo/5 border border-indigo/10 rounded-[30px] flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                          <Info size={18} className="text-indigo" strokeWidth={2.5} />
                        </div>
                        <p className="text-[10px] text-indigo-hover font-bold uppercase tracking-wider leading-relaxed">
                          Harap pastikan <span className="font-black">NISN & NO WHATSAPP</span> sudah benar. Data ini digunakan untuk integrasi ke panel <span className="font-black italic">Portal Orang Tua</span>.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="p-10 pt-5 border-t border-border bg-cream/10">
                  <div className="flex gap-4">
                     {currentStep === 1 ? (
                        <button type="button" onClick={closeModal} className="flex-1 py-4.5 border border-border rounded-3xl text-[11px] font-black text-ink-3 hover:bg-cream transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50" disabled={isSaving}>Batalkan</button>
                     ) : (
                        <button type="button" onClick={handleBack} className="flex-1 py-4.5 border border-border rounded-3xl text-[11px] font-black text-ink-2 hover:bg-cream transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 disabled:opacity-50" disabled={isSaving}><ChevronLeft size={16} strokeWidth={3}/> Sebelumnya</button>
                     ) }

                     {currentStep < totalSteps ? (
                        <button key="btn-next" type="button" onClick={handleNext} className="flex-1 py-4.5 bg-indigo text-white rounded-3xl text-[11px] font-black shadow-xl shadow-indigo/20 hover:bg-indigo-hover hover:-translate-y-1 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-white/10 active:scale-95">Lanjut <ChevronRight size={16} strokeWidth={3}/></button>
                     ) : (
                        <button key="btn-submit" type="submit" className="flex-1 py-4.5 bg-indigo text-white rounded-3xl text-[11px] font-black shadow-xl shadow-indigo/20 hover:bg-indigo-hover hover:-translate-y-1 transition-all uppercase tracking-widest border border-white/10 active:scale-95 disabled:bg-indigo/50" disabled={isSaving}>
                           {isSaving ? "Menyimpan Data..." : "Simpan Database"}
                        </button>
                     )}
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6366F1; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Data Siswa?"
        message="Seluruh data biodata, akun login, dan nilai siswa ini akan dihapus permanen dari dataset. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus Permanen"
      />
    </>
  );
}
