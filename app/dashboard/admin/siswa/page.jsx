"use client";

import { useState, useMemo } from "react";
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
  ChevronRightSquare
} from "lucide-react";
import { MOCK_SISWA, CLASSES } from "../../../lib/siswaData";

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

export default function AdminSiswaPage() {
  const [activeTab, setActiveTab] = useState("Semua Siswa");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [students, setStudents] = useState(MOCK_SISWA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
  const [viewingSiswa, setViewingSiswa] = useState(null);
  
  // Step-by-Step State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Pagination State
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
      const matchClass = selectedClass === "Semua Kelas" || s.kelas === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchTerm, selectedClass]);

  // Paginated Data
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Handler CRUD
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      handleNext();
      return;
    }

    const formData = new FormData(e.target);
    const data = {
      id: editingSiswa ? editingSiswa.id : Date.now(),
      nisn: formData.get("nisn"),
      nis: formData.get("nis"),
      nik: formData.get("nik"),
      nama: formData.get("nama"),
      kelas: formData.get("kelas"),
      gender: formData.get("gender"),
      status: formData.get("status"),
      tempatLahir: formData.get("tempatLahir"),
      tanggalLahir: formData.get("tanggalLahir"),
      alamat: formData.get("alamat"),
      asalSD: formData.get("asalSD"),
      namaAyah: formData.get("namaAyah"),
      namaIbu: formData.get("namaIbu"),
      noHpOrangTua: formData.get("noHpOrangTua"),
      tahunMasuk: formData.get("tahunMasuk"),
      email: formData.get("email"),
    };

    if (editingSiswa) {
      setStudents(students.map(s => s.id === editingSiswa.id ? data : s));
    } else {
      setStudents([data, ...students]);
    }
    closeModal();
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
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        {/* Header & Filters Section */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-ink tracking-tight uppercase">Kelola Data Siswa</h1>
              <p className="text-sm text-ink-3 font-medium mt-1">Sistem Informasi Profil Siswa & Akademik Jamil</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-2xl bg-surface text-ink-2 text-sm font-bold hover:bg-cream transition-all">
                <Download size={16} />
                Export
              </button>
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo text-white rounded-2xl text-[13px] font-bold hover:bg-indigo-hover transition-all shadow-lg shadow-indigo/20"
              >
                <Plus size={20} />
                Tambah Siswa
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border">
              <div className="flex gap-10">
                {["Semua Siswa", "Per Kelas"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSelectedClass("Semua Kelas"); }}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                      activeTab === tab ? "text-indigo" : "text-ink-3 hover:text-ink-2"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari Nama, NISN, atau NIS..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-surface border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all font-medium"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                {activeTab === "Per Kelas" ? (
                  CLASSES.map(cls => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedClass === cls 
                        ? "bg-indigo text-white shadow-md shadow-indigo/20 scale-105" 
                        : "bg-surface border border-border text-ink-2 hover:border-indigo/50"
                      }`}
                    >
                      {cls}
                    </button>
                  ))
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-2xl text-sm text-ink-2">
                    <Filter size={16} className="text-ink-3" />
                    <select 
                      className="bg-transparent outline-none cursor-pointer font-bold"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">No</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">NISN / NIS</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama Siswa</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">Kelas</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((siswa, idx) => (
                      <tr key={siswa.id} className="hover:bg-cream/30 transition-colors group">
                        <td className="px-6 py-4 text-[13px] text-ink-3 font-bold">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="px-6 py-4 font-mono">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-ink-2 leading-none">{siswa.nisn}</span>
                            <span className="text-[9px] font-bold text-ink-3 mt-1 uppercase tracking-tighter">NIS: {siswa.nis || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center text-indigo shrink-0 group-hover:bg-indigo group-hover:text-white transition-colors text-xs font-bold uppercase">
                              {siswa.nama?.charAt(0)}
                            </div>
                            <span className="text-[14px] font-bold text-ink group-hover:text-indigo transition-colors">{siswa.nama}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-indigo-light text-indigo text-[10px] font-black rounded-lg border border-indigo/10 uppercase tracking-widest">
                            {siswa.kelas}
                          </span>
                        </td>
                        <td className="px-6 py-4">{badge(siswa.status)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewingSiswa(siswa)} className="p-2 text-ink-3 hover:text-teal hover:bg-teal-light rounded-lg transition-all"><Eye size={16} /></button>
                            <button onClick={() => openModal(siswa)} className="p-2 text-ink-3 hover:text-indigo hover:bg-indigo-light rounded-lg transition-all"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(siswa.id)} className="p-2 text-ink-3 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <Search size={24} className="mx-auto text-ink-3 mb-2 opacity-50" />
                        <p className="text-sm font-medium text-ink-2">Tidak ada data ditemukan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-border bg-cream/30 flex items-center justify-between flex-wrap gap-4">
              <p className="text-[11px] text-ink-3 font-bold uppercase tracking-widest">
                Showing <span className="text-ink-2">{paginatedStudents.length}</span> of <span className="text-ink-2">{filteredStudents.length}</span>
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
        </div>
      </div>

      {/* MODAL VIEW DETAIL (SHORTER & TIDIER) */}
      {viewingSiswa && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setViewingSiswa(null)} />
          <div className="relative bg-surface w-full max-w-2xl max-h-[85vh] rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp">
            
            <div className="h-28 bg-linear-to-br from-indigo to-indigo-hover relative shrink-0">
              <button onClick={() => setViewingSiswa(null)} className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"><X size={18} /></button>
              <div className="absolute -bottom-10 left-10">
                <div className="w-24 h-24 rounded-[30px] bg-white p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-[24px] bg-indigo-light flex items-center justify-center text-indigo">
                    <User size={40} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-14 pb-8 px-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-xl font-extrabold text-ink tracking-tight leading-none">{viewingSiswa.nama}</h2>
                  <div className="flex items-center gap-3 mt-2 font-bold uppercase tracking-widest text-[10px] text-indigo">
                    <span>Kelas {viewingSiswa.kelas}</span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    {badge(viewingSiswa.status)}
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-ink-3 uppercase tracking-widest leading-none mb-1.5">NISN Member</p>
                   <p className="text-lg font-black text-ink leading-none font-mono">{viewingSiswa.nisn}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo font-black uppercase tracking-widest text-[9px] mb-3">
                    <GraduationCap size={14} /> Informasi Akademik
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[9px] font-bold text-ink-3 uppercase">NIS / NIK</span>
                       <span className="text-[13px] font-bold text-ink font-mono">{viewingSiswa.nis || "-"} / {viewingSiswa.nik || "-"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[9px] font-bold text-ink-3 uppercase">Tempat, Tgl Lahir</span>
                       <span className="text-[13px] font-bold text-ink">{viewingSiswa.tempatLahir || "-"}, {viewingSiswa.tanggalLahir || "-"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[9px] font-bold text-ink-3 uppercase">Jenis Kelamin</span>
                       <span className="text-[13px] font-bold text-ink">{viewingSiswa.gender === "L" ? "Laki-laki" : "Perempuan"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo font-black uppercase tracking-widest text-[9px] mb-3">
                    <Users size={14} /> Kontak Orang Tua
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[9px] font-bold text-ink-3 uppercase">Nama Ayah / Ibu</span>
                       <span className="text-[13px] font-bold text-ink truncate">{viewingSiswa.namaAyah} / {viewingSiswa.namaIbu}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[9px] font-bold text-ink-3 uppercase">No WhatsApp</span>
                       <span className="text-[13px] font-bold text-ink font-mono">{viewingSiswa.noHpOrangTua || "-"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[9px] font-bold text-ink-3 uppercase">Tahun Masuk</span>
                       <span className="text-[13px] font-bold text-ink">{viewingSiswa.tahunMasuk || "2024"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-border flex gap-3">
                <button onClick={() => { setEditingSiswa(viewingSiswa); setViewingSiswa(null); setIsModalOpen(true); }} className="flex-1 py-3.5 bg-indigo text-white rounded-2xl text-[11px] font-black shadow-lg shadow-indigo/20 flex items-center justify-center gap-2 hover:bg-indigo-hover transition-all uppercase tracking-widest"><Edit size={14} /> Edit Profil</button>
                <button className="px-6 py-3.5 border border-border rounded-2xl text-[11px] font-black text-ink-2 hover:bg-cream transition-all uppercase tracking-widest">Print</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WIZARD (COMPACT & SHORTER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => closeModal()} />
          <div className="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp max-h-[85vh]">
            
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-cream/30">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/5">
                  {editingSiswa ? <Edit size={22} /> : <Plus size={22} />}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-ink leading-none">{editingSiswa ? "Update Data Siswa" : "Input Siswa Baru"}</h2>
                  <div className="text-[9px] text-ink-3 mt-1.5 font-bold uppercase tracking-widest flex items-center gap-2">
                     <div className="w-2 h-0.5 bg-indigo/40" /> Profil Peserta Didik
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentStep === step ? "bg-indigo w-5 shadow-sm" : currentStep > step ? "bg-indigo/40" : "bg-border"}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="p-8 pb-4 flex flex-col overflow-y-auto max-h-[50vh] custom-scrollbar">
              <div className="space-y-6">
                {/* --- STEP 1: BIODATA --- */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo mb-1">
                       <User size={12} className="shrink-0" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Langkah 1: Biodata Siswa</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Nama Lengkap Siswa</label>
                      <input type="text" name="nama" defaultValue={editingSiswa?.nama} required placeholder="Sesuai Akte Kelahiran" className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-indigo/10 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Tempat Lahir</label>
                        <input type="text" name="tempatLahir" defaultValue={editingSiswa?.tempatLahir} required className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Tanggal Lahir</label>
                        <input type="date" name="tanggalLahir" defaultValue={editingSiswa?.tanggalLahir} required className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Gender</label>
                        <select name="gender" defaultValue={editingSiswa?.gender || "L"} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold">
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">NIK</label>
                        <input type="text" name="nik" defaultValue={editingSiswa?.nik} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- STEP 2: AKADEMIK --- */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo mb-1">
                       <GraduationCap size={12} className="shrink-0" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Langkah 2: Data Akademik</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">NISN (Nasional)</label>
                        <input type="text" name="nisn" defaultValue={editingSiswa?.nisn} required className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">NIS (Sekolah)</label>
                        <input type="text" name="nis" defaultValue={editingSiswa?.nis} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Kelas</label>
                        <select name="kelas" defaultValue={editingSiswa?.kelas || "VII-A"} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold">
                          {CLASSES.filter(c => c !== "Semua Kelas").map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Tahun Masuk</label>
                        <input type="text" name="tahunMasuk" defaultValue={editingSiswa?.tahunMasuk || "2024"} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold text-center" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Status Keaktifan</label>
                      <select name="status" defaultValue={editingSiswa?.status || "Aktif"} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold">
                         <option value="Aktif">Aktif</option>
                         <option value="Non-Aktif">Non-Aktif</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* --- STEP 3: ORANG TUA --- */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo mb-1">
                       <Users size={12} className="shrink-0" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Langkah 3: Orang Tua & Kontak</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Nama Ayah</label>
                        <input type="text" name="namaAyah" defaultValue={editingSiswa?.namaAyah} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">Nama Ibu</label>
                        <input type="text" name="namaIbu" defaultValue={editingSiswa?.namaIbu} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-ink-3 uppercase ml-1 tracking-widest">WhatsApp Orang Tua</label>
                      <div className="relative">
                         <Phone size={12} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3" />
                         <input type="text" name="noHpOrangTua" defaultValue={editingSiswa?.noHpOrangTua} placeholder="08xxxxxxxx" className="w-full pl-11 pr-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                    </div>
                    <div className="p-4 bg-indigo/5 border border-indigo/10 rounded-2xl flex gap-3">
                      <Info size={14} className="text-indigo shrink-0" />
                      <p className="text-[9px] text-indigo-hover font-bold uppercase tracking-wider leading-relaxed">
                        Data kontak digunakan untuk kebutuhan absensi dan laporan nilai otomatis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* NAV FOOTER */}
            <div className="p-8 border-t border-border bg-cream/10">
              <div className="flex gap-3">
                {currentStep === 1 ? (
                  <button type="button" onClick={closeModal} className="flex-1 py-3.5 border border-border rounded-2xl text-[10px] font-bold text-ink-3 hover:bg-cream transition-all uppercase tracking-widest">Batal</button>
                ) : (
                  <button type="button" onClick={handleBack} className="flex-1 py-3.5 border border-border rounded-2xl text-[10px] font-bold text-ink-2 hover:bg-cream transition-all flex items-center justify-center gap-2 uppercase tracking-widest"><ChevronLeft size={14}/> Kembali</button>
                )}

                {currentStep < totalSteps ? (
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleNext(); }} className="flex-1 py-3.5 bg-indigo text-white rounded-2xl text-[10px] font-extrabold shadow-lg shadow-indigo/20 hover:bg-indigo-hover transition-all flex items-center justify-center gap-2 uppercase tracking-widest">Lanjut <ChevronRight size={14}/></button>
                ) : (
                  <button onClick={(e) => { e.preventDefault(); document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }} className="flex-1 py-3.5 bg-indigo text-white rounded-2xl text-[10px] font-extrabold shadow-lg shadow-indigo/20 hover:bg-indigo-hover transition-all uppercase tracking-widest">Simpan Data</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </>
  );
}
