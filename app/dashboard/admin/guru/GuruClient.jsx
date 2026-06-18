"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { createGuruAction, updateGuruAction, deleteGuruAction, bulkDeleteGuruAction } from "@/lib/actions/guru-actions";
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
  const s = String(status).toUpperCase();
  if (s === "PNS" || s === "ASN") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200/60">
        {status}
      </span>
    );
  }
  if (s === "NON PNS" || s === "NON-PNS" || s === "GTT") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
        {status}
      </span>
    );
  }
  if (s === "INPASSING" || s === "INFANSING") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60">
        {status}
      </span>
    );
  }
  if (s === "SERTIFIKASI") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60">
      {status}
    </span>
  );
};

const formatMapelToList = (mapelString) => {
  if (!mapelString) return ["Umum"];
  const dividers = /\b(?:dan|and|&)\b|[,/]/gi;
  const items = mapelString
    .split(dividers)
    .map(item => item.trim())
    .filter(item => item.length > 0);
  return items.length > 0 ? items : [mapelString];
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

  const [selectedGuruIds, setSelectedGuruIds] = useState([]);

  const toggleSelectGuru = (id) => {
    setSelectedGuruIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedGuruIds.length === paginatedTeachers.length) {
      setSelectedGuruIds([]);
    } else {
      setSelectedGuruIds(paginatedTeachers.map(t => t.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGuruIds.length === 0) return;

    if (!confirm(`Hapus ${selectedGuruIds.length} guru terpilih secara permanen?`)) return;

    setIsDeleting(true);
    try {
      const res = await bulkDeleteGuruAction(selectedGuruIds);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: `${selectedGuruIds.length} data pengajar telah dihapus.`,
          variant: "success",
        });
        setSelectedGuruIds([]);
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
      const password = document.querySelector('input[name="password"]')?.value;

      let errors = {};
      if (!nama) errors.nama = "Nama lengkap wajib diisi";
      if (!nip) errors.nip = "NIP atau identitas wajib diisi";
      if (!editingTeacher && !password) errors.password = "Password wajib diisi";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast({
          title: "Data Belum Lengkap",
          description: "Mohon lengkapi seluruh kolom wajib.",
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
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-indigo to-indigo-hover text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10 cursor-pointer group"
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

        <div className="bg-surface border border-border rounded-[20px] overflow-hidden shadow-card p-2 flex flex-col gap-2">
          <div className="overflow-x-auto rounded-[32px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-cream/40">
                <tr>
                  <th className="px-6 py-5 w-[10px]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                      checked={selectedGuruIds.length === paginatedTeachers.length && paginatedTeachers.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-5 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Rank</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama & NIP</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Spesialisasi</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Kepegawaian</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedTeachers.length > 0 ? (
                  paginatedTeachers.map((guru, idx) => (
                    <tr key={guru.id} className={cn(
                      "hover:bg-cream/20 transition-all group cursor-default",
                      selectedGuruIds.includes(guru.id) ? "bg-indigo-50/30" : ""
                    )}>
                      <td className="px-6 py-5">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                          checked={selectedGuruIds.includes(guru.id)}
                          onChange={() => toggleSelectGuru(guru.id)}
                        />
                      </td>
                      <td className="px-5 py-5 text-[13px] text-ink-3 font-black opacity-30">
                        {String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-ink group-hover:text-indigo group-hover:translate-x-1 transition-all uppercase tracking-tight">{guru.nama}</span>
                          <span className="text-[10px] font-bold text-ink-3 tracking-widest">{guru.nip || "NON-NIP"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1.5 items-start">
                          {formatMapelToList(guru.mapel).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo/40 shrink-0 group-hover:bg-indigo transition-colors" />
                              <span className="text-[11px] font-bold text-ink-2 uppercase tracking-wide leading-tight group-hover:text-ink transition-colors">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5">{badge(guru.status)}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewingTeacher(guru)} className="w-9 h-9 flex items-center justify-center bg-teal/5 text-teal border border-teal/10 hover:bg-teal hover:text-white rounded-2xl transition-all"><Eye size={16} strokeWidth={2.5} /></button>
                          <button onClick={() => openModal(guru)} className="w-9 h-9 flex items-center justify-center bg-indigo/5 text-indigo border border-indigo/10 hover:bg-indigo hover:text-white rounded-2xl transition-all"><Edit size={16} strokeWidth={2.5} /></button>
                          <button onClick={() => openDeleteConfirm(guru.id)} className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={16} strokeWidth={2.5} /></button>
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
              <span className="text-[13px] font-black text-ink leading-none">{paginatedTeachers.length}</span>
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest leading-none">/</p>
              <span className="text-[10px] font-bold text-ink-3">{filteredTeachers.length} Guru</span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center border border-border rounded-2xl bg-surface text-ink-3 hover:bg-cream disabled:opacity-20 transition-all"><ChevronLeft size={16} strokeWidth={3} /></button>
                <div className="flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`min-w-[36px] h-9 text-[11px] font-black rounded-2xl transition-all ${currentPage === i + 1 ? "bg-indigo text-white scale-105 border border-white/10" : "bg-surface border border-border text-ink-3 hover:border-indigo/30"}`}>{i + 1}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center border border-border rounded-2xl bg-surface text-ink-3 hover:bg-cream disabled:opacity-20 transition-all"><ChevronRight size={16} strokeWidth={3} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR FOR BULK DELETE */}
      {selectedGuruIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[101] animate-slideUp">
          <div className="flex items-center gap-8 px-10 py-5 bg-ink text-white rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col">
              <span className="text-[13px] font-black tracking-tight">{selectedGuruIds.length} Pengajar Terpilih</span>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Aksi Massal Tersedia</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedGuruIds([])}
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

      {/* VIEW MODAL */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-10">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-xl" onClick={() => setViewingTeacher(null)} />
          <div className="relative bg-surface w-full max-w-2xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="h-40 bg-linear-to-br from-indigo to-teal-700 relative shrink-0">
              <button onClick={() => setViewingTeacher(null)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-20 border border-white/10">
                <X size={20} strokeWidth={2.5} />
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
              <button onClick={() => { setEditingTeacher(viewingTeacher); setViewingTeacher(null); setIsModalOpen(true); }} className="w-full py-4.5 bg-indigo text-white rounded-2xl text-[11px] font-black flex items-center justify-center gap-3 hover:bg-indigo-hover hover:-translate-y-1 transition-all uppercase tracking-widest border border-white/10 active:scale-95">Edit Profil Guru</button>
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
                  <input type="text" name="nama" defaultValue={editingTeacher?.nama} className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase tracking-tight outline-none", formErrors.nama ? "border-red-500 bg-red-50/10" : "border-border")} />
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
                {!editingTeacher && (
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Password Akun</label>
                    <input type="password" name="password" placeholder="MASUKKAN PASSWORD KUSTOM GURU" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black outline-none", formErrors.password ? "border-red-500 bg-red-50/10" : "border-border")} />
                    {formErrors.password && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2 animate-shake">{formErrors.password}</p>}
                  </div>
                )}
              </div>

              {/* STEP 2: DETAILS */}
              <div className={currentStep !== 2 ? "hidden" : "flex flex-col gap-6"}>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Status Guru</label>
                    <select name="status" defaultValue={editingTeacher?.status || "PNS"} className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none">
                      <option value="PNS">PNS</option>
                      <option value="Non PNS">NON PNS</option>
                      <option value="Inpassing">INPASSING</option>
                      <option value="Sertifikasi">SERTIFIKASI</option>
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
                  <button key="guru-btn-back" type="button" onClick={() => setCurrentStep(1)} className="flex-1 py-4.5 border border-border rounded-2xl text-[11px] font-black text-ink-3 hover:bg-cream transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50" disabled={isSaving}>Kembali</button>
                )}
                {currentStep < totalSteps ? (
                  <button key="guru-btn-next" type="button" onClick={handleNext} className="flex-2 py-4.5 bg-indigo text-white rounded-2xl text-[11px] font-black hover:bg-indigo-hover transition-all uppercase tracking-widest border border-white/10 active:scale-95">
                    Langkah Berikutnya
                  </button>
                ) : (
                  <button key="guru-btn-submit" type="submit" className="flex-2 py-4.5 bg-indigo-hover text-white rounded-2xl text-[11px] font-black hover:bg-teal-700 transition-all uppercase tracking-widest border border-white/10 active:scale-95 disabled:bg-indigo-hover/50" disabled={isSaving}>
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
