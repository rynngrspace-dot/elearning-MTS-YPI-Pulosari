"use client";
import { useState } from "react";
import { Save, ChevronDown, Search } from "lucide-react";

const KELAS = ["X-A","X-B","XI-IPA","XI-IPS","XII-IPA"];
const MAPEL = ["Matematika","Fisika","Kimia","B. Indonesia","B. Inggris"];
const JENIS = ["Ulangan Harian","UTS","UAS","Tugas","Praktikum"];

const siswaList = [
  "Andi Wijaya","Budi Santoso","Citra Dewi","Dian Pratama","Eka Rahayu",
  "Fajar Nugraha","Gita Permata","Hendra Kusuma","Indah Lestari","Joko Santoso",
  "Kartika Sari","Luki Pratama","Maya Putri","Nanda Rizki","Ogi Firmansyah",
  "Putri Anggraini","Qori Amalia","Reza Pahlevy","Sinta Dewi","Teguh Wibowo",
  "Umi Kalsum","Vino Rizaldi","Wulan Sari","Xena Cahya","Yandi Prasetyo",
  "Zara Amelia","Aditya Nugraha","Bagas Ardianto","Cindy Aulia","Dani Setiawan",
  "Elsa Novitasari","Fandi Akbar",
];

const nc = (n) => {
  if (!n && n!==0) return { c:"#A1A1AA", bg:"transparent", label:"-" };
  const v = Number(n);
  if (v>=90) return { c:"#16A34A", bg:"#DCFCE7", label:"A" };
  if (v>=80) return { c:"#0EA5A0", bg:"#CCFBF1", label:"B" };
  if (v>=70) return { c:"#D97706", bg:"#FEF9C3", label:"C" };
  return { c:"#DC2626", bg:"#FEE2E2", label:"D" };
};

export default function GuruNilaiPage() {
  const [kelas, setKelas] = useState("X-A");
  const [mapel, setMapel] = useState("Matematika");
  const [jenis, setJenis] = useState("Ulangan Harian");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [nilai, setNilai] = useState(() =>
    Object.fromEntries(siswaList.map(n => [n, ""]))
  );

  const filtered = siswaList.filter(n => n.toLowerCase().includes(query.toLowerCase()));
  const filled   = Object.values(nilai).filter(v => v !== "").length;
  const avg      = (() => {
    const vals = Object.values(nilai).filter(v=>v!=="").map(Number);
    return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null;
  })();

  const simpan = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const sel = (val,set,opts,bg,c) => (
    <div style={{ position:"relative" }}>
      <select value={val} onChange={e=>set(e.target.value)}
        style={{ appearance:"none", fontSize:12.5, fontWeight:600, padding:"7px 28px 7px 10px",
          borderRadius:8, border:`1px solid ${c}40`, background:bg, color:c, cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif" }}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:c, pointerEvents:"none" }}/>
    </div>
  );

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, animation:"slideUp 0.3s ease both" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:"#18181B" }}>Input Nilai</p>
          <p style={{ fontSize:12, color:"#A1A1AA", marginTop:3 }}>{filled}/{siswaList.length} siswa sudah diisi</p>
        </div>
        <button onClick={simpan} style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#fff", background:saved?"#16A34A":"#6366F1", border:"none", cursor:"pointer", transition:"background 0.2s" }}>
          <Save size={14}/> {saved?"Tersimpan ✓":"Simpan Nilai"}
        </button>
      </div>

      {/* Controls */}
      <div style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        {sel(kelas, setKelas, KELAS, "#EEF2FF","#6366F1")}
        {sel(mapel, setMapel, MAPEL, "#E8F8F7","#0EA5A0")}
        {sel(jenis, setJenis, JENIS, "#FFFBEB","#D97706")}
        <div style={{ flex:1 }}/>
        {avg !== null && (
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:10, background: nc(avg).bg, border:`1px solid ${nc(avg).c}30` }}>
            <p style={{ fontSize:12, fontWeight:600, color:nc(avg).c }}>Rata-rata kelas:</p>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18, color:nc(avg).c }}>{avg}</p>
          </div>
        )}
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:7, background:"#F7F7F5", border:"1px solid #E4E4E7", borderRadius:8, padding:"7px 10px", width:180 }}>
          <Search size={12} style={{ color:"#A1A1AA", flexShrink:0 }}/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari siswa..."
            style={{ background:"transparent", border:"none", outline:"none", fontSize:12.5, color:"#18181B", width:"100%", fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, overflow:"hidden" }}>
        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"48px 1fr 140px 80px", padding:"10px 18px", background:"#F7F7F5", borderBottom:"1px solid #E4E4E7" }}>
          {["No","Nama Siswa","Nilai (0–100)","Predikat"].map((h,i)=>(
            <p key={h} style={{ fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"#A1A1AA", textAlign: i===3?"center":"left" }}>{h}</p>
          ))}
        </div>
        {filtered.map((nama,i) => {
          const v   = nilai[nama];
          const cfg = nc(v);
          return (
            <div key={nama} style={{ display:"grid", gridTemplateColumns:"48px 1fr 140px 80px", padding:"10px 18px", alignItems:"center", borderTop: i>0?"1px solid #F4F4F5":"none", background: v!==""?cfg.bg+"60":"#fff" }}>
              <p style={{ fontSize:12, color:"#A1A1AA" }}>{siswaList.indexOf(nama)+1}</p>
              <p style={{ fontSize:13.5, fontWeight:500, color:"#18181B" }}>{nama}</p>
              <input type="number" min="0" max="100" value={v}
                onChange={e=>setNilai(p=>({...p,[nama]:e.target.value}))}
                placeholder="—"
                style={{ width:80, fontSize:14, fontWeight:600, padding:"6px 10px", borderRadius:8,
                  border:`1.5px solid ${v!==""?cfg.c+"60":"#E4E4E7"}`, background: v!==""?cfg.bg:"#F7F7F5",
                  color: v!==""?cfg.c:"#A1A1AA", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif",
                  textAlign:"center" }}/>
              <p style={{ textAlign:"center", fontSize:12, fontWeight:700,
                color: v!==""?cfg.c:"#C4C4C8" }}>
                {v!==""?cfg.label:"—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}