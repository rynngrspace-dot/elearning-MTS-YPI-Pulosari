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
  GraduationCap, 
  Users, 
  Phone, 
  Mail, 
  Info, 
  BookOpen, 
  Briefcase, 
  MapPin
} from "lucide-react";
import { MOCK_GURU, MAPEL_OPTIONS } from "../../../lib/guruData";

const badgeStatus = (status) => {
  const isPNS = status === "PNS";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
      isPNS ? "bg-indigo/10 text-indigo border border-indigo/20" : "bg-amber-100 text-amber-800 border border-amber-200"
    }`}>
      {status}
    </span>
  );
};

export default function AdminGuruPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("Semua Mapel");
  const [guruList, setGuruList] = useState(MOCK_GURU);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState(null);
  const [viewingGuru, setViewingGuru] = useState(null);
  
  // Step-by-Step State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Filtering logic
  const filteredGuru = useMemo(() => {
    return guruList.filter(g => {
      const matchSearch = g.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (g.nip || "").includes(searchTerm) ||
                          (g.nik || "").includes(searchTerm);
      const matchMapel = selectedMapel === "Semua Mapel" || g.mapel === selectedMapel;
      return matchSearch && matchMapel;
    });
  }, [guruList, searchTerm, selectedMapel]);

  // CRUD Handlers
  const handleDelete = (id) => {
    if (confirm("Hapus data guru ini?")) {
      setGuruList(guruList.filter(g => g.id !== id));
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
      id: editingGuru ? editingGuru.id : Date.now(),
      nip: formData.get("nip"),
      nik: formData.get("nik"),
      nama: formData.get("nama"),
      mapel: formData.get("mapel"),
      gender: formData.get("gender"),
      status: formData.get("status"),
      pendidikan: formData.get("pendidikan"),
      noHp: formData.get("noHp"),
      email: formData.get("email"),
      alamat: formData.get("alamat"),
      tempatLahir: formData.get("tempatLahir"),
      tanggalLahir: formData.get("tanggalLahir")
    };

    if (editingGuru) {
      setGuruList(guruList.map(g => g.id === editingGuru.id ? data : g));
    } else {
      setGuruList([data, ...guruList]);
    }
    closeModal();
  };

  const openModal = (guru = null) => {
    setEditingGuru(guru);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGuru(null);
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
              <h1 className="text-2xl font-black text-ink tracking-tight uppercase">Kelola Data Guru</h1>
              <p className="text-sm text-ink-3 font-medium mt-1">Manajemen pengajar dan wali kelas SMP Jamil</p>
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
                Tambah Guru
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
              <input 
                type="text" 
                placeholder="Cari Nama, NIP, atau NIK Guru..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-surface border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-2xl text-sm text-ink-2">
              <Filter size={16} className="text-ink-3" />
              <select 
                className="bg-transparent outline-none cursor-pointer font-bold pr-2"
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
              >
                <option value="Semua Mapel">Semua Bidang Studi</option>
                {MAPEL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-cream/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">No</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama & Gelar</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">NIP / Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3">Bidang Studi</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredGuru.length > 0 ? (
                  filteredGuru.map((guru, idx) => (
                    <tr key={guru.id} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-6 py-4 text-[13px] text-ink-3 font-bold">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo shrink-0 font-black text-sm group-hover:bg-indigo group-hover:text-white transition-all shadow-sm">
                            {guru.nama.charAt(0)}
                          </div>
                          <span className="text-[14px] font-bold text-ink group-hover:text-indigo transition-colors">{guru.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] font-mono font-bold text-ink-2 leading-none">{guru.nip || "-"}</span>
                          <div>{badgeStatus(guru.status)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-cream border border-border text-ink-2 text-[11px] font-bold rounded-lg flex items-center gap-2 w-fit">
                          <BookOpen size={12} className="text-indigo" />
                          {guru.mapel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewingGuru(guru)} className="p-2 text-ink-3 hover:text-teal hover:bg-teal-light rounded-lg transition-all"><Eye size={16} /></button>
                          <button onClick={() => openModal(guru)} className="p-2 text-ink-3 hover:text-indigo hover:bg-indigo-light rounded-lg transition-all"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(guru.id)} className="p-2 text-ink-3 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <Users size={40} className="mx-auto text-border mb-3" />
                      <p className="text-sm font-bold text-ink-3">Tidak ada data guru ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL VIEW GURU (SHORTER & TIDIER) */}
      {viewingGuru && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setViewingGuru(null)} />
          <div className="relative bg-surface w-full max-w-2xl rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp max-h-[85vh]">
            
            <div className="h-28 bg-linear-to-br from-indigo to-indigo-hover relative shrink-0">
               <button onClick={() => setViewingGuru(null)} className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"><X size={18} /></button>
               <div className="absolute -bottom-10 left-10">
                  <div className="w-24 h-24 rounded-[28px] bg-white p-1.5 shadow-2xl">
                      <div className="w-full h-full rounded-3xl bg-indigo-light flex items-center justify-center text-indigo">
                        <User size={40} strokeWidth={1.5} />
                      </div>
                  </div>
               </div>
            </div>

            <div className="pt-14 pb-8 px-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl font-extrabold text-ink tracking-tight leading-none">{viewingGuru.nama}</h2>
                  <div className="flex items-center gap-3 mt-2 font-bold uppercase tracking-widest text-[10px] text-indigo">
                     {viewingGuru.mapel}
                     <div className="w-1 h-1 rounded-full bg-border" />
                     {viewingGuru.status}
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-ink-3 uppercase tracking-widest mb-1.5 leading-none">Status Pegawai</p>
                   <div>{badgeStatus(viewingGuru.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-indigo font-black uppercase tracking-widest text-[9px] mb-3">
                       <Briefcase size={12} /> Identitas Kerja
                    </div>
                    <div className="space-y-3.5">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-ink-3 uppercase tracking-wider leading-none">NIP / NIK</span>
                          <span className="text-[13px] font-bold text-ink font-mono">{viewingGuru.nip || "-"} / {viewingGuru.nik || "-"}</span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-ink-3 uppercase tracking-wider leading-none">Pendidikan</span>
                          <span className="text-[13px] font-bold text-ink">{viewingGuru.pendidikan || "-"}</span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-ink-3 uppercase tracking-wider leading-none">Bidang Studi</span>
                          <span className="text-[13px] font-bold text-ink">{viewingGuru.mapel}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-indigo font-black uppercase tracking-widest text-[9px] mb-3">
                       <Mail size={12} /> Informasi Kontak
                    </div>
                    <div className="space-y-3.5">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-ink-3 uppercase tracking-wider leading-none">No WhatsApp</span>
                          <span className="text-[13px] font-bold text-ink">{viewingGuru.noHp}</span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-ink-3 uppercase tracking-wider leading-none">Email Resmi</span>
                          <span className="text-[13px] font-bold text-ink lowercase">{viewingGuru.email}</span>
                       </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-indigo font-black uppercase tracking-widest text-[9px] mb-3">
                       <MapPin size={12} /> Alamat Tinggal
                    </div>
                    <p className="text-[12px] font-medium text-ink leading-relaxed capitalize italic">
                       {viewingGuru.alamat}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-border flex gap-3">
                <button 
                   onClick={() => { setEditingGuru(viewingGuru); setViewingGuru(null); setIsModalOpen(true); }}
                   className="flex-1 py-3.5 bg-indigo text-white rounded-2xl text-[11px] font-black shadow-lg shadow-indigo/20 flex items-center justify-center gap-2 hover:bg-indigo-hover transition-all uppercase tracking-widest"
                >
                   <Edit size={14} /> Edit Data
                </button>
                <button className="px-6 py-3.5 border border-border rounded-2xl text-[10px] font-black text-ink-2 hover:bg-cream transition-all uppercase tracking-widest">
                   Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WIZARD CRUD (SHORTER & COMPACT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => closeModal()} />
          <div className="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp max-h-[85vh]">
            
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-cream/30">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/5">
                  {editingGuru ? <Edit size={22} /> : <Plus size={22} />}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-ink leading-none">{editingGuru ? "Edit Data Guru" : "Input Guru Baru"}</h2>
                  <div className="text-[9px] text-ink-3 mt-1.5 font-bold uppercase tracking-widest flex items-center gap-2">
                     <div className="w-2 h-0.5 bg-indigo/40" /> Tenaga Pendidik
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentStep === step ? "bg-indigo w-5" : currentStep > step ? "bg-indigo/40" : "bg-border"}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="p-8 pb-4 flex flex-col overflow-y-auto max-h-[50vh] custom-scrollbar">
              <div className="space-y-6">
                
                {/* STEP 1: PROFIL DASAR */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2.5 text-indigo mb-1">
                       <div className="w-6 h-6 rounded-lg bg-indigo/10 flex items-center justify-center"><User size={12} /></div>
                       <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Identitas Personal</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Nama Lengkap & Gelar</label>
                      <input type="text" name="nama" defaultValue={editingGuru?.nama} required placeholder="Contoh: Budi Santoso, S.Pd." className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-indigo/10 outline-none transition-all placeholder:font-medium placeholder:opacity-40" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">NIP (Opsional)</label>
                        <input type="text" name="nip" defaultValue={editingGuru?.nip} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">NIK</label>
                        <input type="text" name="nik" defaultValue={editingGuru?.nik} required className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-mono font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Gender</label>
                        <select name="gender" defaultValue={editingGuru?.gender || "L"} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold cursor-pointer appearance-none outline-none">
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Tempat Lahir</label>
                        <input type="text" name="tempatLahir" defaultValue={editingGuru?.tempatLahir} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: KOMPETENSI */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2.5 text-indigo mb-1">
                       <div className="w-6 h-6 rounded-lg bg-indigo/10 flex items-center justify-center"><Briefcase size={12} /></div>
                       <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Kompetensi Kerja</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Bidang Studi (Mapel Utama)</label>
                      <select name="mapel" defaultValue={editingGuru?.mapel} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold cursor-pointer appearance-none outline-none">
                        {MAPEL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Status Pegawai</label>
                        <select name="status" defaultValue={editingGuru?.status || "GTT / Honorer"} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold cursor-pointer appearance-none outline-none">
                          <option value="PNS">PNS / ASN</option>
                          <option value="GTT / Honorer">GTT / Honorer</option>
                          <option value="Tetap Yayasan">Tetap Yayasan</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Pendidikan</label>
                        <input type="text" name="pendidikan" defaultValue={editingGuru?.pendidikan} placeholder="S1 Pendidikan..." className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: KONTAK */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2.5 text-indigo mb-1">
                       <div className="w-6 h-6 rounded-lg bg-indigo/10 flex items-center justify-center"><Mail size={12} /></div>
                       <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Kontak & Alamat</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">No WhatsApp</label>
                        <div className="relative">
                           <Phone size={12} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3" />
                           <input type="text" name="noHp" defaultValue={editingGuru?.noHp} required placeholder="08xxxxxxxx" className="w-full pl-11 pr-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Email Aktif</label>
                        <input type="email" name="email" defaultValue={editingGuru?.email} placeholder="email@sekolah.id" className="w-full px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[13px] font-bold" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Alamat Tinggal Lengkap</label>
                      <textarea name="alamat" defaultValue={editingGuru?.alamat} className="px-5 py-3.5 bg-cream/50 border border-border rounded-xl text-[12px] font-medium min-h-[100px] outline-none" placeholder="Alamat domisili saat ini..." />
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* NAV BUTTONS (FIXED AT BOTTOM) */}
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
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </>
  );
}
