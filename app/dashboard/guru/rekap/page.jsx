"use client";
import { useState } from "react";
import { Search, TrendingUp, ChevronDown } from "lucide-react";

const KELAS = ["X-A","X-B","XI-IPA","XI-IPS","XII-IPA"];

const siswaData = [
  { nama:"Andi Wijaya",      kelas:"X-A", kehadiran:95, nilaiRata:88, tugas:{ selesai:8,total:9  }, status:"baik"     },
  { nama:"Budi Santoso",     kelas:"X-A", kehadiran:94, nilaiRata:83, tugas:{ selesai:7,total:9  }, status:"baik"     },
  { nama:"Citra Dewi",       kelas:"X-A", kehadiran:88, nilaiRata:79, tugas:{ selesai:6,total:9  }, status:"cukup"    },
  { nama:"Dian Pratama",     kelas:"X-A", kehadiran:72, nilaiRata:65, tugas:{ selesai:5,total:9  }, status:"perhatian"},
  { nama:"Eka Rahayu",       kelas:"X-A", kehadiran:97, nilaiRata:92, tugas:{ selesai:9,total:9  }, status:"baik"     },
  { nama:"Fajar Nugraha",    kelas:"X-A", kehadiran:60, nilaiRata:58, tugas:{ selesai:3,total:9  }, status:"perhatian"},
  { nama:"Gita Permata",     kelas:"X-A", kehadiran:90, nilaiRata:86, tugas:{ selesai:8,total:9  }, status:"baik"     },
  { nama:"Hendra Kusuma",    kelas:"X-A", kehadiran:85, nilaiRata:77, tugas:{ selesai:7,total:9  }, status:"cukup"    },
  { nama:"Indah Lestari",    kelas:"X-B", kehadiran:98, nilaiRata:95, tugas:{ selesai:9,total:9  }, status:"baik"     },
  { nama:"Joko Santoso",     kelas:"X-B", kehadiran:78, nilaiRata:71, tugas:{ selesai:6,total:9  }, status:"cukup"    },
  { nama:"Kartika Sari",     kelas:"X-B", kehadiran:92, nilaiRata:89, tugas:{ selesai:9,total:9  }, status:"baik"     },
  { nama:"Luki Pratama",     kelas:"X-B", kehadiran:65, nilaiRata:62, tugas:{ selesai:4,total:9  }, status:"perhatian"},
];

const statusCfg = {
  baik:      { label:"Baik",      c:"#16A34A", bg:"#DCFCE7" },
  cukup:     { label:"Cukup",     c:"#D97706", bg:"#FEF9C3" },
  perhatian: { label:"Perhatian", c:"#DC2626", bg:"#FEE2E2" },
};

export default function GuruRekapPage() {
  const [kelas,  setKelas]  = useState("X-A");
  const [query,  setQuery]  = useState("");
  const [sortBy, setSortBy] = useState("nama");

  const filtered = siswaData
    .filter(s => s.kelas === kelas && s.nama.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => sortBy==="nilai" ? b.nilaiRata-a.nilaiRata : sortBy==="kehadiran" ? b.kehadiran-a.kehadiran : a.nama.localeCompare(b.nama));

  const avgNilai    = Math.round(filtered.reduce((s,d)=>s+d.nilaiRata,0)/Math.max(filtered.length,1));
  const avgKehadiran= Math.round(filtered.reduce((s,d)=>s+d.kehadiran,0)/Math.max(filtered.length,1));
  const atRisk      = filtered.filter(d=>d.status==="perhatian").length;

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, animation:"slideUp 0.3s ease both" }}>

      {/* Header */}
      <div>
        <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:"#18181B" }}>Rekap Siswa</p>
        <p style={{ fontSize:12, color:"#A1A1AA", marginTop:3 }}>Semester Genap 2024/2025</p>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {KELAS.map(k=>(
            <button key={k} onClick={()=>setKelas(k)} style={{ fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:99, border:"1px solid", cursor:"pointer", background:kelas===k?"#6366F1":"#fff", color:kelas===k?"#fff":"#52525B", borderColor:kelas===k?"#6366F1":"#E4E4E7" }}>{k}</button>
          ))}
        </div>
        <div style={{ flex:1 }}/>
        {/* Sort */}
        <div style={{ position:"relative" }}>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{ appearance:"none", fontSize:12, fontWeight:500, padding:"7px 28px 7px 10px", borderRadius:8, border:"1px solid #E4E4E7", background:"#fff", color:"#52525B", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            <option value="nama">Urutkan: Nama</option>
            <option value="nilai">Urutkan: Nilai</option>
            <option value="kehadiran">Urutkan: Kehadiran</option>
          </select>
          <ChevronDown size={11} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:"#A1A1AA", pointerEvents:"none" }}/>
        </div>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:7, background:"#fff", border:"1px solid #E4E4E7", borderRadius:8, padding:"7px 10px", width:180 }}>
          <Search size={12} style={{ color:"#A1A1AA" }}/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari siswa..."
            style={{ background:"transparent", border:"none", outline:"none", fontSize:12.5, color:"#18181B", width:"100%", fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { label:"Rata-rata Nilai",    val:avgNilai,     unit:"", color:"#6366F1", bg:"#EEF2FF" },
          { label:"Rata-rata Kehadiran",val:avgKehadiran, unit:"%",color:"#16A34A", bg:"#DCFCE7" },
          { label:"Perlu Perhatian",    val:atRisk,       unit:" siswa", color:"#DC2626", bg:"#FEE2E2" },
        ].map(s=>(
          <div key={s.label} style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:s.bg, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <TrendingUp size={18} style={{ color:s.color }}/>
            </div>
            <div>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:22, color:s.color, lineHeight:1 }}>{s.val}{s.unit}</p>
              <p style={{ fontSize:11.5, color:"#A1A1AA", marginTop:3 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"48px 1fr 110px 110px 120px 100px", padding:"10px 18px", background:"#F7F7F5", borderBottom:"1px solid #E4E4E7" }}>
          {["No","Nama","Kehadiran","Nilai Rata","Tugas","Status"].map((h,i)=>(
            <p key={h} style={{ fontSize:11, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", color:"#A1A1AA", textAlign:i>1?"center":"left" }}>{h}</p>
          ))}
        </div>
        {filtered.map((s,i)=>{
          const stCfg = statusCfg[s.status];
          const tPct  = Math.round((s.tugas.selesai/s.tugas.total)*100);
          const nCfg  = s.nilaiRata>=80?"#16A34A":s.nilaiRata>=70?"#D97706":"#DC2626";
          const hCfg  = s.kehadiran>=80?"#16A34A":s.kehadiran>=70?"#D97706":"#DC2626";
          return (
            <div key={s.nama} style={{ display:"grid", gridTemplateColumns:"48px 1fr 110px 110px 120px 100px", padding:"11px 18px", alignItems:"center", borderTop:i>0?"1px solid #F4F4F5":"none" }}>
              <p style={{ fontSize:12, color:"#A1A1AA" }}>{i+1}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#6366F1" }}>{s.nama.charAt(0)}</span>
                </div>
                <p style={{ fontSize:13.5, fontWeight:500, color:"#18181B" }}>{s.nama}</p>
              </div>
              {/* Kehadiran */}
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:13, fontWeight:700, color:hCfg }}>{s.kehadiran}%</p>
              </div>
              {/* Nilai */}
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:13, fontWeight:700, color:nCfg }}>{s.nilaiRata}</p>
              </div>
              {/* Tugas progress */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <p style={{ fontSize:11.5, fontWeight:600, color:"#52525B" }}>{s.tugas.selesai}/{s.tugas.total}</p>
                <div style={{ width:"80%", height:4, borderRadius:99, background:"#F4F4F5", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${tPct}%`, background:tPct===100?"#16A34A":"#0EA5A0", borderRadius:99 }}/>
                </div>
              </div>
              {/* Status */}
              <div style={{ textAlign:"center" }}>
                <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:99, background:stCfg.bg, color:stCfg.c }}>{stCfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}