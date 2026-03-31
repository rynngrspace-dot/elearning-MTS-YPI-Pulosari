"use client";
import { useState, useMemo, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, X, Users, Clock, ChevronDown,
  FileText, Paperclip, Search, AlertCircle,
  CheckCircle2, ChevronRight, Download,
} from "lucide-react";
import {
  MAPEL_LIST, KELAS_LIST, WARNA_MAPEL, TIPECFG,
  TUGAS_INIT, fmtTglShort, daysUntil,
} from "../../../lib/tugasData";

/* ── shared tugas store via module-level variable (simple mock) ── */
export let tugasStore = [...TUGAS_INIT];
export const addTugas = (t) => { tugasStore = [...tugasStore, t]; };
export const delTugas = (id) => { tugasStore = tugasStore.filter(x => x.id !== id); };

const EMPTY = { judul:"", mapel:"Matematika", kelas:"X-A", deadline:"", deskripsi:"", poin:"100" };

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function GuruTugasPage() {
  const router = useRouter();
  const [tugas,     setTugas]    = useState(TUGAS_INIT);
  const [groupBy,   setGroupBy]  = useState("kelas");
  const [openGrp,   setOpenGrp]  = useState({});
  const [filterKls, setFKls]     = useState("Semua");
  const [search,    setSearch]   = useState("");
  const [modal,     setModal]    = useState(false);
  const [form,      setForm]     = useState(EMPTY);
  const [soalFile,  setSoal]     = useState(null);
  const [errors,    setErrors]   = useState({});

  /* filtered + grouped */
  const filtered = useMemo(() => tugas.filter(t => {
    if (filterKls !== "Semua" && t.kelas !== filterKls) return false;
    if (search && !t.judul.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tugas, filterKls, search]);

  const groups = useMemo(() => {
    const m = {};
    filtered.forEach(t => {
      const k = groupBy === "kelas" ? t.kelas : t.mapel;
      (m[k] ??= []).push(t);
    });
    return m;
  }, [filtered, groupBy]);

  const isOpen = (k) => openGrp[k] !== false;
  const toggle = (k) => setOpenGrp(p => ({ ...p, [k]: !isOpen(k) }));

  /* validate + create */
  const validate = () => {
    const e = {};
    if (!form.judul.trim())     e.judul    = "Wajib diisi";
    if (!form.deadline)         e.deadline = "Wajib diisi";
    if (!form.deskripsi.trim()) e.deskripsi= "Wajib diisi";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const simpan = () => {
    if (!validate()) return;
    const slug = `${slugify(form.judul)}-${form.kelas.toLowerCase().replace("-","")}`;
    const next = {
      ...form, poin: Number(form.poin) || 100,
      id: Date.now(), slug,
      dikumpulkan: 0, total: 32,
      soalFile: soalFile
        ? { name: soalFile.name, tipe: soalFile.name.split(".").pop().toUpperCase() }
        : null,
    };
    setTugas(p => [...p, next]);
    setModal(false); setForm(EMPTY); setSoal(null); setErrors({});
  };

  const hapus = (e, id) => {
    e.stopPropagation();
    setTugas(p => p.filter(t => t.id !== id));
  };

  const goDetail = (t) => {
    router.push(`/dashboard/guru/tugas/${t.slug}`);
  };

  /* mini styles */
  const inp = (err) => ({
    width:"100%", fontSize:13, padding:"8px 10px", borderRadius:9,
    border:`1px solid ${err ? "#DC2626" : "#E4E4E7"}`,
    background:"#F7F7F5", color:"#18181B",
    fontFamily:"'DM Sans',sans-serif", outline:"none",
  });

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, animation:"slideUp 0.3s ease both" }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:"#18181B" }}>
            Kelola Tugas
          </p>
          <p style={{ fontSize:12, color:"#A1A1AA", marginTop:3 }}>
            {tugas.length} tugas · {tugas.filter(t => t.dikumpulkan === t.total).length} selesai
          </p>
        </div>
        <button onClick={() => setModal(true)}
          style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px",
            borderRadius:10, fontSize:13.5, fontWeight:600, color:"#fff",
            background:"#6366F1", border:"none", cursor:"pointer" }}>
          <Plus size={15}/> Buat Tugas
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap",
        background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, padding:"12px 16px" }}>

        {/* Group by toggle */}
        <div style={{ display:"flex", background:"#F4F4F5", borderRadius:9, padding:3, gap:2 }}>
          {["kelas","mapel"].map(g => (
            <button key={g} onClick={() => setGroupBy(g)}
              style={{ fontSize:12, fontWeight:600, padding:"5px 14px", borderRadius:7, border:"none", cursor:"pointer",
                background: groupBy===g ? "#fff"      : "transparent",
                color:      groupBy===g ? "#6366F1"   : "#52525B",
                boxShadow:  groupBy===g ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition:"all 0.15s" }}>
              Per {g === "kelas" ? "Kelas" : "Mapel"}
            </button>
          ))}
        </div>

        <div style={{ width:1, height:22, background:"#E4E4E7" }}/>

        {/* Kelas filter */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {["Semua", ...KELAS_LIST].map(k => (
            <button key={k} onClick={() => setFKls(k)}
              style={{ fontSize:11, fontWeight:500, padding:"4px 10px", borderRadius:99, border:"1px solid", cursor:"pointer",
                background:   filterKls===k ? "#EEF2FF" : "#fff",
                color:        filterKls===k ? "#6366F1" : "#52525B",
                borderColor:  filterKls===k ? "#6366F1" : "#E4E4E7" }}>
              {k}
            </button>
          ))}
        </div>

        <div style={{ flex:1 }}/>

        <div style={{ display:"flex", alignItems:"center", gap:7, background:"#F7F7F5",
          border:"1px solid #E4E4E7", borderRadius:9, padding:"7px 11px", width:200 }}>
          <Search size={12} style={{ color:"#A1A1AA", flexShrink:0 }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul tugas..."
            style={{ background:"transparent", border:"none", outline:"none",
              fontSize:12.5, color:"#18181B", width:"100%", fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
      </div>

      {/* ── Accordion groups ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {Object.keys(groups).length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#A1A1AA" }}>
            <AlertCircle size={30} style={{ margin:"0 auto 10px" }}/>
            <p style={{ fontSize:14 }}>Tidak ada tugas ditemukan</p>
          </div>
        ) : Object.entries(groups).map(([gk, items]) => {
          const open    = isOpen(gk);
          const totSub  = items.reduce((s,t) => s + t.dikumpulkan, 0);
          const totAll  = items.reduce((s,t) => s + t.total, 0);
          const grpPct  = totAll ? Math.round((totSub/totAll)*100) : 0;
          const acC     = groupBy === "mapel" ? (WARNA_MAPEL[gk]||"#6366F1") : "#6366F1";

          return (
            <div key={gk} style={{ background:"#fff", border:"1px solid #E4E4E7",
              borderRadius:14, boxShadow:"0 1px 3px rgba(0,0,0,0.04)", overflow:"hidden" }}>

              {/* Group header */}
              <button onClick={() => toggle(gk)}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:12,
                  padding:"13px 18px", background:"none", border:"none", cursor:"pointer",
                  borderBottom: open ? "1px solid #F0F0F0" : "none" }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:acC, flexShrink:0 }}/>
                <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
                  fontSize:14, color:"#18181B", flex:1, textAlign:"left" }}>
                  {groupBy === "kelas" ? `Kelas ${gk}` : gk}
                </p>
                <span style={{ fontSize:11.5, color:"#A1A1AA", marginRight:8 }}>
                  {items.length} tugas
                </span>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:60, height:4, borderRadius:99, background:"#F0F0F0", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${grpPct}%`, borderRadius:99,
                      background: grpPct===100 ? "#16A34A" : "#6366F1" }}/>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, minWidth:28,
                    color: grpPct===100 ? "#16A34A" : "#6366F1" }}>{grpPct}%</span>
                </div>
                <ChevronDown size={14} style={{ color:"#C4C4C8", flexShrink:0,
                  transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s" }}/>
              </button>

              {/* Tugas rows */}
              {open && (
                <div>
                  {items.map((t, idx) => {
                    const pct  = Math.round((t.dikumpulkan / t.total) * 100);
                    const barC = pct===100 ? "#16A34A" : pct>=70 ? "#0EA5A0" : "#F59E0B";
                    const days = daysUntil(t.deadline);
                    const w    = WARNA_MAPEL[t.mapel] || "#6366F1";

                    return (
                      <div key={t.id}
                        onClick={() => goDetail(t)}
                        style={{
                          display:"flex", alignItems:"stretch",
                          borderTop: idx > 0 ? "1px solid #F4F4F5" : "none",
                          cursor:"pointer", transition:"background 0.1s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background="#FAFAFA"}
                        onMouseLeave={e => e.currentTarget.style.background="#fff"}>

                        {/* Left color stripe */}
                        <div style={{ width:3, background:w, flexShrink:0 }}/>

                        {/* Content */}
                        <div style={{ flex:1, padding:"14px 16px", display:"flex",
                          alignItems:"center", gap:14, minWidth:0 }}>

                          {/* Mapel icon */}
                          <div style={{ width:40, height:40, borderRadius:11, background:w+"18",
                            flexShrink:0, display:"flex", alignItems:"center",
                            justifyContent:"center", fontSize:18 }}>
                            { {Matematika:"📐",Fisika:"⚡",Kimia:"🧪","B. Indonesia":"📝","B. Inggris":"📖",Sejarah:"🏛️"}[t.mapel] || "📄" }
                          </div>

                          {/* Main info */}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:5 }}>
                              {groupBy==="kelas" && (
                                <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px",
                                  borderRadius:99, background:w+"18", color:w }}>{t.mapel}</span>
                              )}
                              {groupBy==="mapel" && (
                                <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px",
                                  borderRadius:99, background:"#F4F4F5", color:"#52525B" }}>Kelas {t.kelas}</span>
                              )}
                              {days<=1&&days>=0 && (
                                <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px",
                                  borderRadius:99, background:"#FEF2F2", color:"#DC2626", display:"flex", alignItems:"center", gap:3 }}>
                                  <AlertCircle size={9}/>Deadline dekat
                                </span>
                              )}
                              {days<0&&pct<100 && (
                                <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px",
                                  borderRadius:99, background:"#FEF2F2", color:"#DC2626" }}>Lewat deadline</span>
                              )}
                              {pct===100 && (
                                <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px",
                                  borderRadius:99, background:"#DCFCE7", color:"#16A34A", display:"flex", alignItems:"center", gap:3 }}>
                                  <CheckCircle2 size={9}/>Selesai
                                </span>
                              )}
                              {t.soalFile && (
                                <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px",
                                  borderRadius:99, background:TIPECFG[t.soalFile.tipe]?.bg||"#F4F4F5",
                                  color:TIPECFG[t.soalFile.tipe]?.c||"#52525B", display:"flex", alignItems:"center", gap:3 }}>
                                  <FileText size={9}/>{t.soalFile.tipe}
                                </span>
                              )}
                            </div>

                            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600,
                              fontSize:14, color:"#18181B", marginBottom:4,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {t.judul}
                            </p>

                            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                              <span style={{ fontSize:11.5, color:"#A1A1AA", display:"flex", alignItems:"center", gap:3 }}>
                                <Clock size={10}/> {fmtTglShort(t.deadline)}
                              </span>
                              <span style={{ fontSize:11.5, color:"#A1A1AA", display:"flex", alignItems:"center", gap:3 }}>
                                <Users size={10}/> {t.dikumpulkan}/{t.total}
                              </span>
                            </div>
                          </div>

                          {/* Progress */}
                          <div style={{ width:100, flexShrink:0 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                              <span style={{ fontSize:10.5, color:"#A1A1AA" }}>Progress</span>
                              <span style={{ fontSize:11, fontWeight:700, color:barC }}>{pct}%</span>
                            </div>
                            <div style={{ height:5, borderRadius:99, background:"#F0F0F0", overflow:"hidden" }}>
                              <div style={{ height:"100%", width:`${pct}%`, background:barC, borderRadius:99 }}/>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div style={{ display:"flex", gap:6, flexShrink:0 }}
                            onClick={e => e.stopPropagation()}>
                            <button onClick={() => goDetail(t)}
                              style={{ display:"inline-flex", alignItems:"center", gap:5,
                                fontSize:12, fontWeight:600, padding:"6px 12px", borderRadius:8,
                                border:"1px solid #6366F1", background:"#EEF2FF", color:"#6366F1",
                                cursor:"pointer", whiteSpace:"nowrap" }}>
                              Lihat Detail <ChevronRight size={12}/>
                            </button>
                            <button onClick={e => hapus(e, t.id)}
                              style={{ width:32, height:32, borderRadius:8, border:"1px solid #FEE2E2",
                                background:"#FEF2F2", display:"flex", alignItems:"center",
                                justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                              <Trash2 size={13} style={{ color:"#DC2626" }}/>
                            </button>
                          </div>

                          <ChevronRight size={14} style={{ color:"#D4D4D8", flexShrink:0 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Create Modal ── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center",
          justifyContent:"center", padding:16, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)" }}>
          <div style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:520,
            boxShadow:"0 24px 64px rgba(0,0,0,0.2)", animation:"slideUp 0.2s ease",
            maxHeight:"92vh", overflowY:"auto" }}>

            <div style={{ padding:"20px 24px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:"#18181B" }}>
                Buat Tugas Baru
              </p>
              <button onClick={() => { setModal(false); setErrors({}); setSoal(null); }}
                style={{ width:30, height:30, borderRadius:8, border:"1px solid #E4E4E7",
                  background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <X size={14} style={{ color:"#A1A1AA" }}/>
              </button>
            </div>

            <div style={{ padding:"16px 24px 24px", display:"flex", flexDirection:"column", gap:13 }}>

              <div>
                <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>Judul Tugas</p>
                <input value={form.judul} onChange={e=>setForm(p=>({...p,judul:e.target.value}))}
                  placeholder="Contoh: Latihan Soal Integral" style={inp(errors.judul)}/>
                {errors.judul && <p style={{ fontSize:11, color:"#DC2626", marginTop:3 }}>{errors.judul}</p>}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[["Mata Pelajaran","mapel",MAPEL_LIST],["Kelas","kelas",KELAS_LIST]].map(([lbl,key,opts])=>(
                  <div key={key}>
                    <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>{lbl}</p>
                    <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={inp(false)}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>Deadline</p>
                  <input type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} style={inp(errors.deadline)}/>
                  {errors.deadline && <p style={{ fontSize:11, color:"#DC2626", marginTop:3 }}>{errors.deadline}</p>}
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>Poin</p>
                  <input type="number" value={form.poin} onChange={e=>setForm(p=>({...p,poin:e.target.value}))} style={inp(false)}/>
                </div>
              </div>

              <div>
                <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>Instruksi Tugas</p>
                <textarea value={form.deskripsi} onChange={e=>setForm(p=>({...p,deskripsi:e.target.value}))}
                  rows={3} placeholder="Tulis instruksi lengkap untuk siswa..."
                  style={{ ...inp(errors.deskripsi), resize:"none" }}/>
                {errors.deskripsi && <p style={{ fontSize:11, color:"#DC2626", marginTop:3 }}>{errors.deskripsi}</p>}
              </div>

              {/* File upload */}
              <div>
                <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>
                  File Soal <span style={{ color:"#A1A1AA", fontWeight:400 }}>(opsional)</span>
                </p>
                <label style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
                  borderRadius:12, cursor:"pointer",
                  border:`2px dashed ${soalFile ? "#6366F1" : "#E4E4E7"}`,
                  background: soalFile ? "#EEF2FF" : "#F7F7F5" }}>
                  {soalFile ? (
                    <>
                      <div style={{ width:34, height:34, borderRadius:8, flexShrink:0,
                        background:TIPECFG[soalFile.name.split(".").pop().toUpperCase()]?.bg||"#F4F4F5",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <FileText size={15} style={{ color:TIPECFG[soalFile.name.split(".").pop().toUpperCase()]?.c||"#52525B" }}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:600, color:"#6366F1",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{soalFile.name}</p>
                        <p style={{ fontSize:11, color:"#A1A1AA", marginTop:1 }}>{(soalFile.size/1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={e=>{e.preventDefault();setSoal(null);}}
                        style={{ width:22, height:22, borderRadius:6, border:"1px solid #E4E4E7",
                          background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                        <X size={10} style={{ color:"#A1A1AA" }}/>
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ width:34, height:34, borderRadius:8, background:"#E4E4E7", flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Paperclip size={15} style={{ color:"#A1A1AA" }}/>
                      </div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:500, color:"#18181B" }}>Klik untuk upload file soal</p>
                        <p style={{ fontSize:11, color:"#A1A1AA", marginTop:1 }}>PDF, DOCX, PPTX, XLSX — maks. 20 MB</p>
                      </div>
                    </>
                  )}
                  <input type="file" style={{ display:"none" }}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                    onChange={e => setSoal(e.target.files[0]||null)}/>
                </label>
              </div>

              <button onClick={simpan}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                  padding:"11px 0", borderRadius:10, fontSize:14, fontWeight:600,
                  color:"#fff", background:"#6366F1", border:"none", cursor:"pointer", marginTop:2 }}>
                <Plus size={15}/> Buat & Publikasikan Tugas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}