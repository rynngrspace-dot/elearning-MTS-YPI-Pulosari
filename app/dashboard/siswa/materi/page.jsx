"use client";
import { useState } from "react";
import { Download, Eye, Search, BookOpen } from "lucide-react";

/* ── Data ─────────────────────────────────────────────────── */
const materi = [
  { id:1, mapel:"Matematika",  judul:"Integral Tak Tentu",       tipe:"PDF",  ukuran:"2.3 MB", guru:"Pak Hendra", uploadedAt:new Date("2025-03-08"), deskripsi:"Materi integral tak tentu beserta contoh soal dan pembahasan.", warna:"#0EA5A0", icon:"📐" },
  { id:2, mapel:"Fisika",      judul:"Gelombang Mekanik",        tipe:"PDF",  ukuran:"4.1 MB", guru:"Pak Rudi",   uploadedAt:new Date("2025-03-07"), deskripsi:"Konsep gelombang mekanik, transversal & longitudinal.", warna:"#F59E0B", icon:"⚡" },
  { id:3, mapel:"B. Indonesia",judul:"Teks Argumentasi",         tipe:"DOCX", ukuran:"1.5 MB", guru:"Bu Sari",    uploadedAt:new Date("2025-03-06"), deskripsi:"Struktur dan ciri kebahasaan teks argumentasi.", warna:"#6366F1", icon:"📝" },
  { id:4, mapel:"Kimia",       judul:"Ikatan Kimia",             tipe:"PDF",  ukuran:"3.8 MB", guru:"Bu Rina",    uploadedAt:new Date("2025-03-05"), deskripsi:"Ikatan ionik, kovalen, dan logam.", warna:"#8B5CF6", icon:"🧪" },
  { id:5, mapel:"Sejarah",     judul:"Penjajahan Belanda",       tipe:"PDF",  ukuran:"2.0 MB", guru:"Pak Bima",   uploadedAt:new Date("2025-03-04"), deskripsi:"Kronologi penjajahan Belanda di Indonesia.", warna:"#F97316", icon:"🏛️" },
  { id:6, mapel:"B. Inggris",  judul:"Narrative Text",           tipe:"PDF",  ukuran:"1.2 MB", guru:"Bu Dewi",    uploadedAt:new Date("2025-03-03"), deskripsi:"Generic structure of narrative text.", warna:"#EC4899", icon:"📖" },
  { id:7, mapel:"B. Indonesia",judul:"Teks Eksposisi",           tipe:"DOCX", ukuran:"1.5 MB", guru:"Bu Sari",    uploadedAt:new Date("2025-03-10"), deskripsi:"Struktur teks eksposisi.", warna:"#6366F1", icon:"📝" },
  { id:8, mapel:"Matematika",  judul:"Turunan Fungsi Aljabar",   tipe:"PDF",  ukuran:"1.8 MB", guru:"Pak Hendra", uploadedAt:new Date("2025-03-09"), deskripsi:"Aturan turunan fungsi aljabar.", warna:"#0EA5A0", icon:"📐" },
];

/* ── Helpers ─────────────────────────────────────────────── */
const formatTgl = (d) =>
  d.toLocaleDateString("id-ID",{ day:"numeric",month:"short",year:"numeric" });

const isNew = (d) => {
  const diffDays=(Date.now()-d.getTime())/(1000*60*60*24);
  return diffDays<=3;
};

const allMapel=["Semua",...new Set(materi.map(m=>m.mapel))];

/* ── Component ───────────────────────────────────────────── */
export default function MateriPage() {
  const [filter,setFilter]=useState("Semua");
  const [query,setQuery]=useState("");

  const filtered = materi
    .filter(m=>{
      const mM = filter==="Semua" || m.mapel===filter;
      const mQ = m.judul.toLowerCase().includes(query.toLowerCase())
      || m.mapel.toLowerCase().includes(query.toLowerCase());
      return mM && mQ;
    })
    .sort((a,b)=>b.uploadedAt-a.uploadedAt);

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-xl text-zinc-900 font-['Plus_Jakarta_Sans']">
            Materi Pelajaran
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {materi.length} materi tersedia · diurutkan dari terbaru
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 w-[220px]">
          <Search size={13} className="text-zinc-400"/>
          <input
            type="text"
            placeholder="Cari materi..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            className="bg-transparent outline-none text-sm text-zinc-800 w-full"
          />
        </div>
      </div>
    
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {allMapel.map(mapel => (
          <button
            key={mapel}
            onClick={() => setFilter(mapel)}
            className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer
            ${filter===mapel
              ?"bg-teal-500 text-white border-teal-500"
              :"bg-white text-zinc-600 border-zinc-200"}`}
          >
            {mapel}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length>0 ?(
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m,idx)=>(
            <div
              key={m.id}
              className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 flex flex-col gap-3"
              style={{
                outline: idx===0 && filter==="Semua" && !query
                  ? `2px solid ${m.warna}30`
                  : "none"
              }}
            >

              {/* Top */}
              <div className="flex gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{background:m.warna+"18"}}
                >
                  {m.icon}
                </div>

                <div className="flex-1">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[11px] font-semibold px-2 py-[2px] rounded-full"
                      style={{background:m.warna+"18",color:m.warna}}
                    >
                      {m.mapel}
                    </span>

                    {isNew(m.uploadedAt)&&(
                      <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-emerald-50 text-emerald-600">
                        BARU
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-sm text-zinc-900">
                    {m.judul}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 leading-relaxed">
                {m.deskripsi}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-200 mt-auto">
                <div>
                  <p className="text-sm font-medium text-zinc-600">{m.guru}</p>
                  <p className="text-xs text-zinc-400">
                    {m.tipe} · {m.ukuran} · {formatTgl(m.uploadedAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="w-8 h-8 border border-zinc-200 rounded-md flex items-center justify-center cursor-pointer">
                    <Eye size={13} className="text-zinc-600"/>
                  </button>

                  <button className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center cursor-pointer">
                    <Download size={13} className="text-white"/>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ):(
        <div className="text-center py-16">
          <BookOpen size={36} className="text-zinc-400 mx-auto mb-3"/>
          <p className="text-sm font-medium text-zinc-600">
            Materi tidak ditemukan
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Coba kata kunci atau filter lain
          </p>
        </div>
      )}
    </div>
  );
}