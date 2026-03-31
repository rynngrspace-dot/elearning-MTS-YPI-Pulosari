"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  X, 
  School, 
  MapPin, 
  User, 
  ArrowLeft,
  Settings,
  Download,
  Filter,
  Info
} from "lucide-react";
import { MOCK_GURU } from "../../../../lib/guruData";
import { MOCK_KELAS } from "../../../../lib/kelasData";
import { MOCK_SISWA } from "../../../../lib/siswaData";

export default function ClassDetailPage({ params }) {
  const unwrappedParams = use(params);
  const classSlug = unwrappedParams.id; // e.g., "vii-a"

  // Data State
  const [students, setStudents] = useState(MOCK_SISWA);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSearchQuery, setAvailableSearchQuery] = useState("");

  // Find the class by slug
  const currentKelas = useMemo(() => {
    return MOCK_KELAS.find(k => k.namaKelas.toLowerCase() === classSlug);
  }, [classSlug]);

  if (!currentKelas) {
    return (
      <div className="p-12 flex flex-col items-center justify-center animate-fadeIn text-center">
        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-ink-3 mb-6"><School size={40} /></div>
        <h2 className="text-xl font-extrabold text-ink tracking-tight uppercase">Kelas Tidak Ditemukan</h2>
        <p className="text-sm text-ink-3 font-medium mt-2 mb-8">Maaf, data rombel yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/dashboard/admin/kelas" className="px-8 py-3.5 bg-indigo text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo/20">Kembali ke Daftar Kelas</Link>
      </div>
    );
  }

  const getWaliName = (id) => {
    const guru = MOCK_GURU.find(g => g.id === Number(id));
    return guru ? guru.nama : "Belum Ditentukan";
  };

  // Logic: Current Enrolled Students
  const enrolledStudents = useMemo(() => {
    return students.filter(s => 
      s.kelas === currentKelas.namaKelas &&
      s.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, currentKelas, searchQuery]);

  // Logic: Available Students to Add
  const availableStudents = useMemo(() => {
    return students.filter(s => 
      (!s.kelas || s.kelas === "Belum Ada Kelas") &&
      s.nama.toLowerCase().includes(availableSearchQuery.toLowerCase())
    );
  }, [students, availableSearchQuery]);

  // Handlers
  const unenrollStudent = (id) => {
    if (confirm("Keluarkan siswa ini dari kelas?")) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, kelas: null } : s));
    }
  };

  const enrollStudent = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, kelas: currentKelas.namaKelas } : s));
    setIsAddModalOpen(false);
  };

  const stats = {
    total: enrolledStudents.length,
    pria: enrolledStudents.filter(s => s.gender === "L").length,
    wanita: enrolledStudents.filter(s => s.gender === "P").length,
    remaining: currentKelas.kapasitas - enrolledStudents.length
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white to-cream/10 animate-slideUp">
      
      {/* 1. REFINED HEADER SECTION */}
      <div className="px-6 md:px-12 py-7 bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <Link href="/dashboard/admin/kelas" className="w-11 h-11 rounded-2xl bg-cream hover:bg-indigo hover:text-white flex items-center justify-center text-ink-3 transition-all group shadow-inner">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             </Link>
             <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 text-[9px] font-semibold text-ink-3 uppercase tracking-widest mb-1 opacity-60">
                   Administrasi <ChevronLeft size={8} className="rotate-180" /> Kelas <ChevronLeft size={8} className="rotate-180" /> {currentKelas.namaKelas}
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-ink tracking-tight uppercase leading-none">Kelas {currentKelas.namaKelas}</h1>
                  <div className="px-3 py-0.5 bg-indigo-light border border-indigo/20 text-indigo text-[10px] font-black rounded-full uppercase tracking-widest shadow-inner">Lvl {currentKelas.tingkat}</div>
                </div>
                <div className="flex items-center gap-4 mt-2 font-bold text-[11px] text-ink-3 uppercase tracking-widest opacity-80">
                   <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo" /> {currentKelas.ruangan}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-border" />
                   <span className="italic flex items-center gap-1.5">Wali: {getWaliName(currentKelas.waliKelasId)}</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
             <button className="p-3.5 bg-white border border-border text-ink-3 rounded-2xl hover:text-indigo hover:border-indigo/30 transition-all shadow-sm"><Settings size={16}/></button>
             <button 
               onClick={() => setIsAddModalOpen(true)}
               className="flex items-center gap-3 px-7 py-3.5 bg-indigo text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-hover transition-all shadow-lg shadow-indigo/20 group"
             >
               <UserPlus size={16} className="group-hover:scale-110 transition-transform" /> Tambah Siswa ke Kelas
             </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12 space-y-10">
        
        {/* 2. STATS GRID (MORE COMPACT) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Total Siswa", val: stats.total, sub: "Orang", icon: <Users size={24} />, bg: "bg-indigo-light", text: "text-indigo" },
             { label: "Laki-laki", val: stats.pria, sub: "Siswa", icon: <User size={24} />, bg: "bg-green-50", text: "text-green-600" },
             { label: "Perempuan", val: stats.wanita, sub: "Siswi", icon: <User size={24} />, bg: "bg-purple-50", text: "text-purple-600" },
             { label: "Sisa Kuota", val: stats.remaining, sub: "Slot", icon: <Filter size={24} />, bg: "bg-indigo", text: "text-white", isHighlight: true },
           ].map((stat, i) => (
             <div key={i} className={`bg-surface border ${stat.isHighlight ? "border-indigo/20 shadow-indigo/5 bg-linear-to-br from-white to-indigo/3" : "border-border shadow-xs"} rounded-3xl p-6 flex items-center gap-5 hover:shadow-md transition-all group`}>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center group-hover:scale-105 transition-transform ${stat.isHighlight ? "shadow-lg shadow-indigo/20" : ""}`}>
                   {stat.icon}
                </div>
                <div className="min-w-0">
                   <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 opacity-60 ${stat.isHighlight ? "text-indigo" : "text-ink-3"}`}>{stat.label}</p>
                   <h4 className="text-xl font-extrabold text-ink leading-none">{stat.val} <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter ml-0.5">{stat.sub}</span></h4>
                </div>
             </div>
           ))}
        </div>

        {/* 3. MAIN CONTENT AREA */}
        <div className="bg-surface border border-border rounded-[32px] overflow-hidden shadow-card flex flex-col min-h-[500px]">
           <div className="px-10 py-6 border-b border-border bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-10">
                 {["Daftar Siswa di Kelas", "Jadwal & Agenda", "Inventaris Kelas"].map((tab, i) => (
                   <button key={tab} className={`pb-5 text-[11px] font-black uppercase tracking-widest relative transition-colors ${i === 0 ? "text-indigo" : "text-ink-3 hover:text-ink"}`}>
                      {tab}
                      {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo rounded-full" />}
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-3">
                 <div className="relative group">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Cari nama siswa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:w-56 pl-10 pr-4 py-2.5 bg-cream/30 border border-border rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all"
                    />
                 </div>
                 <button className="p-3 bg-white border border-border text-ink-3 rounded-xl hover:text-indigo hover:border-indigo/30 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-sm"><Download size={14} /> Export</button>
              </div>
           </div>

           <div className="flex-1 overflow-x-auto p-3">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-cream/40 border-b border-border">
                    <tr>
                       <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-ink-3">No</th>
                       <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-ink-3">Profil Siswa</th>
                       <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-ink-3">Identitas (NISN)</th>
                       <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-ink-3">Gender</th>
                       <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-ink-3">Status</th>
                       <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-ink-3 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/60">
                    {enrolledStudents.length > 0 ? (
                      enrolledStudents.map((siswa, idx) => (
                        <tr key={siswa.id} className="hover:bg-cream/20 transition-colors group">
                           <td className="px-7 py-4 text-[12px] text-ink-3 font-bold">{idx + 1}</td>
                           <td className="px-7 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-9 h-9 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo shrink-0 font-black text-[13px] group-hover:bg-indigo group-hover:text-white transition-all shadow-xs">{siswa.nama.charAt(0)}</div>
                                 <span className="text-[13.5px] font-bold text-ink group-hover:text-indigo transition-colors">{siswa.nama}</span>
                              </div>
                           </td>
                           <td className="px-7 py-4">
                              <div className="flex flex-col gap-0.5">
                                 <span className="text-[12px] font-mono font-bold text-ink-2">{siswa.nisn}</span>
                                 <span className="text-[9px] font-bold text-ink-3 uppercase tracking-tighter opacity-60 leading-none">NIS: {siswa.nis || "-"}</span>
                              </div>
                           </td>
                           <td className="px-7 py-4 text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-80">{siswa.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
                           <td className="px-7 py-4">
                              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-black rounded-full uppercase tracking-widest border border-green-100 shadow-inner">Aktif</span>
                           </td>
                           <td className="px-7 py-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                 <button className="p-2.5 text-ink-3 hover:text-indigo hover:bg-white rounded-xl border border-transparent hover:border-border transition-all"><Info size={14}/></button>
                                 <button onClick={() => unenrollStudent(siswa.id)} className="p-2.5 text-ink-3 hover:text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all"><Trash2 size={14}/></button>
                              </div>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                         <td colSpan="6" className="px-8 py-24 text-center">
                            <div className="w-16 h-16 bg-cream/50 rounded-full flex items-center justify-center text-ink-3 mx-auto mb-5 opacity-40"><Users size={32} /></div>
                            <h5 className="text-[15px] font-extrabold text-ink tracking-tight uppercase leading-none">Rombel Belum Terisi</h5>
                            <p className="text-ink-3 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto opacity-60">Siswa yang belum memiliki kelas dapat ditambahkan melalui tombol Tambah Siswa.</p>
                         </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* 4. REFINED SELECTION MODAL (COMPACT & CLEAN) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp max-h-[85vh]">
            
            <div className="px-8 py-6 border-b border-border bg-cream/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center shadow-inner border border-indigo/5"><UserPlus size={20} /></div>
                <div>
                  <h3 className="text-xl font-extrabold text-ink tracking-tight leading-none uppercase">Tambah Siswa</h3>
                  <div className="text-[10px] text-ink-3 font-bold uppercase tracking-widest mt-2 opacity-70 flex items-center gap-2">
                     <div className="w-2 h-0.5 bg-indigo/40" /> Penempatan Rombel
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-ink-3 hover:text-red-500 rounded-full border border-border shadow-sm transition-all"><X size={14} /></button>
            </div>

            <div className="p-8 bg-white/50 border-b border-border/60 shrink-0">
               <div className="relative group">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Nama atau NISN Siswa..." 
                    value={availableSearchQuery}
                    onChange={(e) => setAvailableSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 bg-cream/40 border border-border/40 rounded-xl text-[13.5px] font-bold focus:ring-4 focus:ring-indigo/5 outline-none transition-all focus:border-indigo/40 placeholder:opacity-40"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-cream/10 min-h-[350px]">
               <div className="space-y-1.5">
                  {availableStudents.length > 0 ? (
                    availableStudents.map(s => (
                       <div key={s.id} className="p-4 bg-white border border-border rounded-2xl flex items-center justify-between hover:border-indigo/40 hover:shadow-lg hover:shadow-indigo/5 transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-light text-indigo flex items-center justify-center group-hover:bg-indigo group-hover:text-white transition-all shadow-inner font-black text-xs">{s.nama.charAt(0)}</div>
                             <div>
                                <h4 className="text-[13px] font-bold text-ink tracking-tight leading-tight group-hover:text-indigo transition-colors">{s.nama}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                   <div className="px-2 py-0.5 bg-indigo-light/30 border border-indigo/10 text-[8px] font-black uppercase text-indigo tracking-widest rounded-md">NISN</div>
                                   <p className="text-[10px] font-mono font-bold text-ink-3 opacity-60 uppercase tracking-tighter">{s.nisn}</p>
                                </div>
                             </div>
                          </div>
                          <button 
                             onClick={() => enrollStudent(s.id)}
                             className="px-5 py-2.5 bg-white border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-ink-2 hover:bg-indigo hover:text-white hover:border-indigo transition-all shadow-xs group/pilih flex items-center gap-2"
                          >
                             Pilih <ArrowLeft size={12} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                       </div>
                    ))
                  ) : (
                    <div className="text-center py-20 animate-fadeIn">
                       <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-ink-3 mx-auto mb-5 shadow-xs border border-border/50"><Search size={24} className="opacity-20" /></div>
                       <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Siswa tidak ditemukan.</p>
                       <p className="text-[8px] font-bold text-ink-3 uppercase tracking-widest mt-2 opacity-40">Coba kata kunci pencarian lain</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-8 border-t border-border bg-white flex justify-end">
               <button onClick={() => setIsAddModalOpen(false)} className="w-full py-3.5 bg-indigo text-white rounded-2xl text-[10px] font-black hover:bg-indigo-hover transition-all uppercase tracking-widest shadow-lg shadow-indigo/20">Selesai Memilih</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
