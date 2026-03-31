"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  User,
  GraduationCap,
  Users,
  Info,
  ChevronRight,
  School,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  Search,
  MapPin,
  Check
} from "lucide-react";
import { MOCK_GURU } from "../../../lib/guruData";
import { MOCK_KELAS } from "../../../lib/kelasData";
import { MOCK_SISWA } from "../../../lib/siswaData";

export default function AdminKelasPage() {
  const [kelasList, setKelasList] = useState(MOCK_KELAS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid | table

  // Student count calculation (based on MOCK_SISWA)
  const studentCountMap = useMemo(() => {
    const map = {};
    MOCK_SISWA.forEach(s => {
      if (s.kelas) {
        map[s.kelas] = (map[s.kelas] || 0) + 1;
      }
    });
    return map;
  }, []);

  const getWaliName = (id) => {
    const guru = MOCK_GURU.find(g => g.id === Number(id));
    return guru ? guru.nama : "Belum Ditentukan";
  };

  const handleDelete = (id) => {
    if (confirm("Hapus data kelas ini?")) {
      setKelasList(kelasList.filter(k => k.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: editingKelas ? editingKelas.id : Date.now(),
      namaKelas: formData.get("namaKelas"),
      tingkat: formData.get("tingkat"),
      waliKelasId: Number(formData.get("waliKelasId")),
      kapasitas: formData.get("kapasitas"),
      ruangan: formData.get("ruangan"),
    };

    if (editingKelas) {
      setKelasList(kelasList.map(k => k.id === editingKelas.id ? data : k));
    } else {
      setKelasList([...kelasList, data]);
    }
    setIsModalOpen(false);
    setEditingKelas(null);
  };

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-2xl font-black text-ink tracking-tight uppercase">Kelola Data Kelas</h1>
            <p className="text-sm text-ink-3 font-medium mt-1">Pengaturan rombel, wali kelas, dan pembagian ruangan</p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <div className="bg-cream/50 p-1.5 rounded-2xl border border-border flex items-center gap-1 shadow-inner">
                <button onClick={() => setViewMode("grid")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${viewMode === "grid" ? "bg-white text-indigo shadow-md scale-105" : "text-ink-3 hover:text-ink-2"}`}><LayoutGrid size={13} /> Card</button>
                <button onClick={() => setViewMode("table")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${viewMode === "table" ? "bg-white text-indigo shadow-md scale-105" : "text-ink-3 hover:text-ink-2"}`}><ListIcon size={13} /> Table</button>
             </div>

             <button onClick={() => { setEditingKelas(null); setIsModalOpen(true); }} className="flex items-center gap-3 px-6 py-4 bg-indigo text-white rounded-2xl text-[11px] font-black hover:bg-indigo-hover transition-all shadow-lg shadow-indigo/20 w-fit uppercase tracking-widest group"><Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Buka Kelas Baru</button>
          </div>
        </div>

        {/* VIEW MODE: GRID */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {kelasList.map((kelas) => (
              <div key={kelas.id} className="bg-surface border border-border rounded-[32px] p-7 hover:shadow-2xl hover:shadow-indigo/10 hover:border-indigo-border transition-all duration-500 group relative flex flex-col h-full bg-linear-to-b from-white to-cream/10">
                <div className="absolute top-7 right-7"><div className="px-3 py-0.5 bg-indigo-light border border-indigo/20 text-indigo text-[9px] font-black rounded-full uppercase tracking-widest shadow-inner">Lvl {kelas.tingkat}</div></div>
                <div className="flex items-start justify-between mb-6"><div className="w-12 h-12 rounded-xl bg-indigo-light flex items-center justify-center text-indigo shadow-inner border border-indigo/5 group-hover:scale-105 transition-transform"><School size={24} strokeWidth={1.5} /></div></div>
                <div className="space-y-1 mb-7">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold text-ink tracking-tight group-hover:text-indigo transition-colors duration-300 leading-tight">Kelas {kelas.namaKelas}</h3>
                    <div className="flex items-center gap-2 text-ink-3 mt-1 opacity-70"><MapPin size={10} className="text-indigo/50" /><span className="text-[9px] font-bold uppercase tracking-widest leading-none">{kelas.ruangan}</span></div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 pt-7 border-t border-border/40">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream/30 border border-border/40 group-hover:bg-white transition-colors duration-300">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo shadow-xs border border-border/10 shrink-0"><User size={16} /></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8.5px] font-bold text-ink-3 uppercase tracking-widest mb-1 opacity-60 leading-none">Wali Kelas</span>
                      <span className="text-[13px] font-bold text-ink leading-tight truncate">{getWaliName(kelas.waliKelasId)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-cream/30 rounded-2xl border border-border/30 shadow-inner group-hover:bg-indigo/5 group-hover:border-indigo/10 transition-all duration-300">
                     <div className="flex flex-col">
                        <span className="text-[8.5px] font-bold text-ink-3 uppercase tracking-widest mb-1 opacity-60 leading-none">Terdaftar</span>
                        <span className="text-lg font-extrabold text-ink tracking-tighter flex items-end gap-1 leading-none">
                          {studentCountMap[kelas.namaKelas] || 0} 
                          <span className="text-[10px] text-ink-3 font-bold opacity-60">/ {kelas.kapasitas}</span>
                        </span>
                     </div>
                     <div className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center text-indigo group-hover:rotate-12 transition-transform"><Users size={16} /></div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mt-7">
                   <Link 
                     href={`/dashboard/admin/kelas/${kelas.namaKelas.toLowerCase()}`}
                     className="flex-1 py-3 bg-indigo text-white border border-indigo/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-hover transition-all flex items-center justify-center gap-2 group/btn shadow-md shadow-indigo/10"
                   >
                      Lihat Siswa <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                   </Link>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingKelas(kelas); setIsModalOpen(true); }} className="p-3 bg-white border border-border text-ink-3 hover:text-indigo hover:border-indigo/30 rounded-xl transition-all shadow-sm"><Edit size={13}/></button>
                      <button onClick={() => handleDelete(kelas.id)} className="p-3 bg-white border border-border text-ink-3 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm"><Trash2 size={13}/></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW MODE: TABLE */}
        {viewMode === "table" && (
          <div className="bg-surface border border-border rounded-[24px] overflow-hidden shadow-card animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/50 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">No</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Tingkat</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama Kelas</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Wali Kelas</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kelasList.map((kelas, idx) => (
                    <tr key={kelas.id} className="hover:bg-cream/20 transition-colors group">
                      <td className="px-8 py-5 text-[13px] text-ink-3 font-bold">{idx + 1}</td>
                      <td className="px-8 py-5"><span className="px-3 py-1 bg-indigo-light text-indigo text-[9px] font-black rounded-full uppercase tracking-widest border border-indigo/10 shadow-inner">Lvl {kelas.tingkat}</span></td>
                      <td className="px-8 py-5 font-bold text-ink text-sm uppercase tracking-wider">{kelas.namaKelas}</td>
                      <td className="px-8 py-5 text-[13.5px] font-bold text-ink-2">{getWaliName(kelas.waliKelasId)}</td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/admin/kelas/${kelas.namaKelas.toLowerCase()}`} className="p-2 text-ink-3 hover:text-indigo hover:bg-indigo-light rounded-lg transition-all border border-transparent hover:border-indigo/10"><Users size={14}/></Link>
                            <button onClick={() => { setEditingKelas(kelas); setIsModalOpen(true); }} className="p-2 text-ink-3 hover:text-indigo hover:bg-indigo-light rounded-lg transition-all border border-transparent hover:border-indigo/10"><Edit size={14}/></button>
                            <button onClick={() => handleDelete(kelas.id)} className="p-2 text-ink-3 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 size={14}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD/EDIT KELAS (REMAINING MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-border overflow-hidden flex flex-col animate-slideUp max-h-[85vh]">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-cream/30">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-2xl bg-indigo text-white flex items-center justify-center shadow-lg shadow-indigo/10 ring-4 ring-indigo/5">
                  <div className="relative">
                    <School size={18} strokeWidth={2} />
                    {editingKelas ? <Edit size={9} className="absolute -top-1 -right-1 bg-white text-indigo rounded-full p-0.5 shadow-sm" /> : <Plus size={9} className="absolute -top-1 -right-1 bg-white text-indigo rounded-full p-0.5 shadow-sm" />}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-ink tracking-tight uppercase leading-none">{editingKelas ? "Edit Rombel" : "Buka Kelas Baru"}</h2>
                  <div className="text-[10px] text-ink-3 font-bold uppercase tracking-widest mt-1.5 opacity-70 flex items-center gap-2"><div className="w-2 h-0.5 bg-indigo/40" /> Data Akademik</div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-ink-3 hover:text-red-600 rounded-full transition-all border border-border hover:border-red-100 shadow-sm"><X size={14} /></button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto max-h-[55vh] custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-indigo"><div className="w-6 h-6 rounded-lg bg-indigo/10 flex items-center justify-center"><School size={12} /></div><span className="text-[10px] font-bold uppercase tracking-widest">Identitas Dasar</span></div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2"><label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Nama Rombel</label><input type="text" name="namaKelas" defaultValue={editingKelas?.namaKelas} required placeholder="Contoh: VII-A" className="w-full px-5 py-3 bg-cream/50 border border-border rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-indigo/10 outline-none transition-all placeholder:font-medium placeholder:opacity-40 uppercase focus:border-indigo" /></div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Tingkat</label>
                    <div className="relative">
                      <GraduationCap size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
                      <select name="tingkat" defaultValue={editingKelas?.tingkat || "7"} className="w-full pl-12 pr-5 py-3 bg-cream/50 border border-border rounded-xl text-[13px] font-bold cursor-pointer appearance-none outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all">
                        <option value="7">Kelas 7 (VII)</option>
                        <option value="8">Kelas 8 (VIII)</option>
                        <option value="9">Kelas 9 (IX)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2"><label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Gedung / Lokasi</label><div className="relative group"><MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" /><input type="text" name="ruangan" defaultValue={editingKelas?.ruangan} required placeholder="Contoh: Gedung A, Lt.2" className="w-full pl-12 pr-5 py-3 bg-cream/50 border border-border rounded-xl text-[13px] font-bold transition-all focus:ring-4 focus:ring-indigo/10 outline-none focus:border-indigo" /></div></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-indigo"><div className="w-6 h-6 rounded-lg bg-indigo/10 flex items-center justify-center"><Users size={12} /></div><span className="text-[10px] font-bold uppercase tracking-widest">Manajemen</span></div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Wali Kelas</label>
                  <div className="relative group"><User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors pointer-events-none" /><select name="waliKelasId" defaultValue={editingKelas?.waliKelasId} required className="w-full pl-12 pr-10 py-3 bg-cream/50 border border-border rounded-xl text-[13px] font-bold cursor-pointer appearance-none outline-none focus:ring-4 focus:ring-indigo/10 focus:border-indigo transition-all"><option value="">-- Pilih Wali Kelas --</option>{MOCK_GURU.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}</select></div>
                </div>
                <div className="flex flex-col gap-2"><label className="text-[9px] font-bold text-ink-3 uppercase tracking-widest ml-1">Kapasitas</label><div className="relative group"><Users size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" /><input type="number" name="kapasitas" defaultValue={editingKelas?.kapasitas || 40} required className="w-full pl-12 pr-5 py-3 bg-cream/50 border border-border rounded-xl text-[13px] font-bold focus:ring-4 focus:ring-indigo/10 outline-none focus:border-indigo transition-all" /><span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-ink-3 uppercase leading-none">Siswa</span></div></div>
              </div>
            </form>
            <div className="p-8 border-t border-border bg-cream/10"><div className="flex gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border border-border rounded-2xl text-[10px] font-bold text-ink-3 hover:bg-cream transition-all uppercase tracking-widest">Batal</button><button onClick={() => document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} className="flex-[1.5] py-3.5 bg-indigo text-white rounded-2xl text-[10px] font-extrabold shadow-lg shadow-indigo/20 hover:bg-indigo-hover transition-all uppercase tracking-widest text-center">Simpan Data</button></div></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  );
}
