"use client";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Clock, Users, FileText, Download,
  CheckCircle2, AlertCircle, Search, ChevronDown,
  Star, MoreHorizontal, Filter,
} from "lucide-react";
import {
  TUGAS_INIT, WARNA_MAPEL, TIPECFG, SISWA_LIST,
  genSubmissions, fmtTgl, fmtTglShort, daysUntil,
} from "../../../../lib/tugasData";

const SUBCFG = {
  dikumpulkan:{ label:"Dikumpulkan", c:"#16A34A", bg:"#DCFCE7", icon:CheckCircle2 },
  terlambat:  { label:"Terlambat",   c:"#EA580C", bg:"#FFEDD5", icon:Clock        },
  belum:      { label:"Belum",       c:"#A1A1AA", bg:"#F4F4F5", icon:AlertCircle  },
};

export default function TugasDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();

  /* Find tugas by slug */
  const tugas = TUGAS_INIT.find(t => t.slug === id);

  const [subSearch,  setSubSearch]  = useState("");
  const [filterStat, setFilterStat] = useState("semua");
  const [nilaiEdit,  setNilaiEdit]  = useState({});

  const subs = useMemo(() =>
    tugas ? genSubmissions(tugas.id, tugas.dikumpulkan, tugas.total) : [],
  [tugas]);

  const filtered = useMemo(() => subs.filter(s => {
    if (filterStat !== "semua" && s.status !== filterStat) return false;
    if (subSearch && !s.nama.toLowerCase().includes(subSearch.toLowerCase())) return false;
    return true;
  }), [subs, filterStat, subSearch]);

  if (!tugas) return (
    <div style={{ padding:40, textAlign:"center", color:"#A1A1AA" }}>
      <AlertCircle size={40} style={{ margin:"0 auto 12px" }}/>
      <p style={{ fontSize:16, fontWeight:600 }}>Tugas tidak ditemukan</p>
      <button onClick={() => router.back()}
        style={{ marginTop:16, fontSize:13, color:"#6366F1", background:"none", border:"none", cursor:"pointer" }}>
        ← Kembali
      </button>
    </div>
  );

  const pct  = Math.round((tugas.dikumpulkan / tugas.total) * 100);
  const barC = pct===100 ? "#16A34A" : pct>=70 ? "#0EA5A0" : "#F59E0B";
  const days = daysUntil(tugas.deadline);
  const w    = WARNA_MAPEL[tugas.mapel] || "#6366F1";

  const counts = {
    semua:       subs.length,
    dikumpulkan: subs.filter(s => s.status === "dikumpulkan").length,
    terlambat:   subs.filter(s => s.status === "terlambat").length,
    belum:       subs.filter(s => s.status === "belum").length,
  };

  const TABS = [
    { key:"semua",       label:`Semua (${counts.semua})`                   },
    { key:"dikumpulkan", label:`✓ Terkumpul (${counts.dikumpulkan})`        },
    { key:"terlambat",   label:`⏰ Terlambat (${counts.terlambat})`         },
    { key:"belum",       label:`⏳ Belum (${counts.belum})`                 },
  ];

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, animation:"slideUp 0.3s ease both" }}>

      {/* ── Back button ── */}
      <button onClick={() => router.back()}
        style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:500,
          color:"#52525B", background:"none", border:"none", cursor:"pointer", alignSelf:"flex-start",
          padding:"4px 0" }}>
        <ArrowLeft size={14}/> Kembali ke Kelola Tugas
      </button>

      {/* ── Hero card ── */}
      <div style={{ borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        {/* Colored top band */}
        <div style={{ background:`linear-gradient(135deg, ${w}, ${w}cc)`, padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
            <div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99,
                  background:"rgba(255,255,255,0.25)", color:"#fff" }}>{tugas.mapel}</span>
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99,
                  background:"rgba(255,255,255,0.25)", color:"#fff" }}>Kelas {tugas.kelas}</span>
                {tugas.soalFile && (
                  <span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99,
                    background:"rgba(255,255,255,0.25)", color:"#fff", display:"inline-flex", alignItems:"center", gap:3 }}>
                    <FileText size={9}/>{tugas.soalFile.tipe}
                  </span>
                )}
                {days<=1&&days>=0 && (
                  <span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99,
                    background:"rgba(239,68,68,0.9)", color:"#fff" }}>Deadline dekat!</span>
                )}
              </div>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:22,
                color:"#fff", marginBottom:6 }}>{tugas.judul}</p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.75)" }}>
                🕐 Deadline: {fmtTgl(tugas.deadline)} · {tugas.poin} poin
              </p>
            </div>
            {/* Circular progress */}
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <div style={{ width:72, height:72, borderRadius:"50%", position:"relative",
                background:`conic-gradient(#fff ${pct*3.6}deg, rgba(255,255,255,0.25) 0deg)`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:54, height:54, borderRadius:"50%", background:w,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
                    fontSize:16, color:"#fff", lineHeight:1 }}>{pct}%</p>
                </div>
              </div>
              <p style={{ fontSize:10.5, color:"rgba(255,255,255,0.7)", marginTop:6 }}>Terkumpul</p>
            </div>
          </div>
        </div>

        {/* Stat bar */}
        <div style={{ background:"#fff", padding:"16px 24px",
          display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0,
          borderBottom:"1px solid #F0F0F0" }}>
          {[
            { label:"Dikumpulkan", val:`${tugas.dikumpulkan}`,  sub:`dari ${tugas.total}`, c:"#16A34A" },
            { label:"Belum",       val:`${tugas.total-tugas.dikumpulkan}`, sub:"siswa",    c:"#DC2626" },
            { label:"Terlambat",   val:`${counts.terlambat}`,  sub:"siswa",               c:"#EA580C" },
            { label:"Deadline",    val:fmtTglShort(tugas.deadline), sub:days>0?`${days} hari lagi`:days===0?"Hari ini":"Lewat", c:days<=0?"#DC2626":"#52525B" },
          ].map((s,i) => (
            <div key={s.label} style={{ padding:"12px 16px", textAlign:"center",
              borderLeft: i>0 ? "1px solid #F0F0F0" : "none" }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
                fontSize:22, color:s.c, lineHeight:1, marginBottom:3 }}>{s.val}</p>
              <p style={{ fontSize:11, color:"#A1A1AA" }}>{s.label}</p>
              <p style={{ fontSize:10.5, color:s.c+"99", marginTop:1 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Description + file soal */}
        <div style={{ background:"#fff", padding:"16px 24px",
          display:"grid", gridTemplateColumns: tugas.soalFile ? "1fr auto" : "1fr", gap:16,
          alignItems:"start" }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.06em", color:"#A1A1AA", marginBottom:8 }}>Instruksi</p>
            <p style={{ fontSize:14, color:"#52525B", lineHeight:1.75 }}>{tugas.deskripsi}</p>
          </div>
          {tugas.soalFile && (
            <div style={{ background:"#F7F7F5", border:"1px solid #E4E4E7", borderRadius:12,
              padding:"12px 16px", display:"flex", alignItems:"center", gap:12, minWidth:220 }}>
              <div style={{ width:38, height:38, borderRadius:9,
                background:TIPECFG[tugas.soalFile.tipe]?.bg||"#F4F4F5",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <FileText size={17} style={{ color:TIPECFG[tugas.soalFile.tipe]?.c||"#52525B" }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12.5, fontWeight:600, color:"#18181B",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {tugas.soalFile.name}
                </p>
                <p style={{ fontSize:11, color:"#A1A1AA", marginTop:2 }}>File soal tugas</p>
              </div>
              <button style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12,
                fontWeight:600, padding:"5px 12px", borderRadius:8, background:"#6366F1",
                color:"#fff", border:"none", cursor:"pointer", flexShrink:0 }}>
                <Download size={12}/> Unduh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Submission list ── */}
      <div style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:16,
        boxShadow:"0 1px 3px rgba(0,0,0,0.04)", overflow:"hidden" }}>

        {/* List header */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #F0F0F0",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
            fontSize:15, color:"#18181B" }}>
            Daftar Pengumpulan
          </p>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", gap:7, background:"#F7F7F5",
            border:"1px solid #E4E4E7", borderRadius:9, padding:"7px 11px", width:200 }}>
            <Search size={12} style={{ color:"#A1A1AA", flexShrink:0 }}/>
            <input value={subSearch} onChange={e => setSubSearch(e.target.value)}
              placeholder="Cari nama siswa..."
              style={{ background:"transparent", border:"none", outline:"none",
                fontSize:12.5, color:"#18181B", width:"100%", fontFamily:"'DM Sans',sans-serif" }}/>
          </div>
        </div>

        {/* Status tabs */}
        <div style={{ display:"flex", gap:0, borderBottom:"1px solid #F0F0F0", overflowX:"auto" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setFilterStat(tab.key)}
              style={{ fontSize:12.5, fontWeight:filterStat===tab.key ? 600 : 400,
                padding:"11px 18px", background:"none", border:"none", cursor:"pointer",
                color: filterStat===tab.key ? "#6366F1" : "#52525B",
                borderBottom: filterStat===tab.key ? "2px solid #6366F1" : "2px solid transparent",
                whiteSpace:"nowrap", transition:"all 0.15s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"48px 1fr 120px 100px 80px 80px",
          padding:"10px 20px", background:"#FAFAFA", borderBottom:"1px solid #F0F0F0" }}>
          {["No","Nama Siswa","Waktu Kumpul","File","Nilai","Status"].map((h,i) => (
            <p key={h} style={{ fontSize:11, fontWeight:700, letterSpacing:"0.05em",
              textTransform:"uppercase", color:"#A1A1AA",
              textAlign: i > 1 ? "center" : "left" }}>{h}</p>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding:"40px 0", textAlign:"center", color:"#A1A1AA" }}>
            <p style={{ fontSize:13 }}>Tidak ada data</p>
          </div>
        ) : filtered.map((s, i) => {
          const cfg  = SUBCFG[s.status];
          const Icon = cfg.icon;
          const no   = subs.indexOf(s) + 1;
          const nilaiVal = nilaiEdit[s.nama] !== undefined ? nilaiEdit[s.nama] : (s.nilai ?? "");
          const nc   = nilaiVal !== "" ? (Number(nilaiVal)>=80?"#16A34A":Number(nilaiVal)>=70?"#D97706":"#DC2626") : "#A1A1AA";

          return (
            <div key={s.nama} style={{
              display:"grid", gridTemplateColumns:"48px 1fr 120px 100px 80px 80px",
              padding:"11px 20px", alignItems:"center",
              borderTop: i > 0 ? "1px solid #F7F7F5" : "none",
              background: s.status==="belum" ? "#fff" : cfg.bg+"30",
            }}>
              {/* No */}
              <p style={{ fontSize:12, color:"#A1A1AA" }}>{no}</p>

              {/* Nama */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
                  background:cfg.bg, border:`1.5px solid ${cfg.c}40`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:cfg.c }}>{s.nama.charAt(0)}</span>
                </div>
                <p style={{ fontSize:13.5, fontWeight:500, color:"#18181B" }}>{s.nama}</p>
              </div>

              {/* Waktu */}
              <p style={{ fontSize:12.5, color: s.waktu ? "#52525B" : "#D4D4D8",
                textAlign:"center" }}>
                {s.waktu ? `${s.waktu} WIB` : "—"}
              </p>

              {/* File */}
              <div style={{ textAlign:"center" }}>
                {s.file ? (
                  <button style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11.5,
                    fontWeight:600, padding:"4px 9px", borderRadius:7, border:"1px solid #E4E4E7",
                    background:"#fff", color:"#52525B", cursor:"pointer" }}>
                    <Download size={11}/> Unduh
                  </button>
                ) : (
                  <span style={{ fontSize:12, color:"#D4D4D8" }}>—</span>
                )}
              </div>

              {/* Nilai — inline editable */}
              <div style={{ textAlign:"center" }}>
                <input
                  type="number" min="0" max="100"
                  value={nilaiVal}
                  onChange={e => setNilaiEdit(p => ({ ...p, [s.nama]: e.target.value }))}
                  placeholder="—"
                  disabled={s.status === "belum"}
                  style={{ width:52, fontSize:13, fontWeight:700, padding:"4px 6px",
                    textAlign:"center", borderRadius:7,
                    border:`1.5px solid ${nilaiVal!=="" ? nc+"60" : "#E4E4E7"}`,
                    background: nilaiVal!=="" ? nc+"18" : "#F7F7F5",
                    color: nilaiVal!=="" ? nc : "#A1A1AA",
                    outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif",
                    cursor: s.status==="belum" ? "not-allowed" : "text" }}/>
              </div>

              {/* Status badge */}
              <div style={{ textAlign:"center" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:3,
                  fontSize:10.5, fontWeight:600, padding:"3px 8px", borderRadius:99,
                  background:cfg.bg, color:cfg.c, whiteSpace:"nowrap" }}>
                  <Icon size={9}/>{cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}