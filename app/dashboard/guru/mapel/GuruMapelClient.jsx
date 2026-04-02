"use client";

import { BookMarked, Search, ArrowRight, BookOpen, GraduationCap, School } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GuruMapelClient({ initialMapel }) {
  const [search, setSearch] = useState("");

  const filteredMapel = initialMapel.filter(m => 
    m.nama.toLowerCase().includes(search.toLowerCase()) || 
    m.kelas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 flex flex-col gap-10 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white shadow-xl shadow-indigo/20">
            <BookMarked size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="px-2.5 py-1 bg-indigo-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-[0.2em]">Pusat Akademik</span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[9px] text-ink-3 font-bold uppercase tracking-widest leading-none">Manajemen Pembelajaran</p>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight uppercase leading-none">Mata Pelajaran Pengampu</h1>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="relative group max-w-xl">
        <div className="absolute left-4.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center text-indigo group-focus-within:bg-indigo group-focus-within:text-white transition-all shadow-inner">
           <Search size={14} strokeWidth={2.5} />
        </div>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="CARI MATA PELAJARAN ATAU KELAS..." 
          className="w-full pl-15 pr-7 py-3.5 bg-surface border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo/10 transition-all shadow-sm group-hover:border-indigo/20"
        />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMapel.length > 0 ? filteredMapel.map((m) => (
          <div key={m.id} className="bg-surface border border-border rounded-2xl p-8 shadow-sm hover:border-indigo/30 transition-all group overflow-hidden relative">
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
               <GraduationCap size={140} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-11 h-11 rounded-xl bg-indigo-light flex items-center justify-center text-indigo shadow-inner">
                  <BookOpen size={20} />
                </div>
                <span className="px-2.5 py-1 bg-cream border border-border text-ink-3 text-[8px] font-bold rounded-lg uppercase tracking-widest">Aktif</span>
              </div>

              <h3 className="text-lg font-bold text-ink uppercase tracking-tight mb-1">{m.nama}</h3>
              <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-6 flex items-center gap-2 outline-none leading-none">
                 <School size={11} className="text-indigo/60" /> {m.kelas} · {m.siswa} Siswa
              </p>

              <div className="p-4 bg-cream/30 rounded-xl border border-border/50 mb-7">
                <div className="flex items-center justify-between mb-1.5">
                   <span className="text-[8px] font-bold text-ink-3 uppercase tracking-widest">Jadwal Sesi</span>
                   <span className="text-[9px] font-bold text-indigo uppercase">{m.hari}</span>
                </div>
                <p className="text-[13px] font-bold text-ink tabular-nums">{m.jam || "Belum Diatur"}</p>
              </div>

              <div className="flex gap-2.5">
                <Link 
                  href={`/dashboard/guru/materi?mapelId=${m.mapelId}&kelasId=${m.kelasId}`} 
                  className="group/btn flex items-center justify-center gap-2 flex-1 py-3 bg-indigo text-white rounded-xl text-[8.5px] font-bold uppercase tracking-widest shadow-lg shadow-indigo/10 hover:bg-indigo-600 transition-all"
                >
                   Materi <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href={`/dashboard/guru/tugas?mapelId=${m.mapelId}&kelasId=${m.kelasId}`} 
                  className="group/btn flex items-center justify-center gap-2 flex-1 py-3 bg-indigo-light text-indigo border border-indigo-100 rounded-xl text-[8.5px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                >
                   Tugas <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )) : (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale lowercase">
              <BookOpen size={60} className="mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">Tidak ada mata pelajaran ditemukan</p>
           </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
