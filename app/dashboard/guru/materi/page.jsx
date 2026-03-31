"use client";
import { useState } from "react";
import { Upload, Trash2, Eye, X, Paperclip, FileText, Plus } from "lucide-react";

const MAPEL = ["Matematika","Fisika","Kimia","B. Indonesia","B. Inggris","Sejarah"];
const KELAS = ["Semua Kelas","X-A","X-B","XI-IPA","XI-IPS","XII-IPA"];
const warnaMeta = { Matematika:"#0EA5A0",Fisika:"#F59E0B",Kimia:"#8B5CF6","B. Indonesia":"#6366F1","B. Inggris":"#EC4899",Sejarah:"#F97316" };
const iconMeta  = { Matematika:"📐",Fisika:"⚡",Kimia:"🧪","B. Indonesia":"📝","B. Inggris":"📖",Sejarah:"🏛️" };

const initMateri = [
  { id:1, mapel:"Matematika",  judul:"Integral Tak Tentu",     tipe:"PDF",  ukuran:"2.3 MB", kelas:"X-A",   tgl:"2025-03-08", deskripsi:"Materi integral tak tentu beserta contoh soal.",         unduhan:14 },
  { id:2, mapel:"Fisika",      judul:"Gelombang Mekanik",      tipe:"PDF",  ukuran:"4.1 MB", kelas:"X-A",   tgl:"2025-03-07", deskripsi:"Konsep gelombang mekanik, transversal & longitudinal.",  unduhan:11 },
  { id:3, mapel:"B. Indonesia",judul:"Teks Argumentasi",       tipe:"DOCX", ukuran:"1.5 MB", kelas:"X-B",   tgl:"2025-03-06", deskripsi:"Struktur teks argumentasi beserta contoh.",              unduhan:20 },
  { id:4, mapel:"Kimia",       judul:"Ikatan Kimia",           tipe:"PDF",  ukuran:"3.8 MB", kelas:"XI-IPA",tgl:"2025-03-05", deskripsi:"Ikatan ionik, kovalen, dan logam.",                      unduhan:17 },
  { id:5, mapel:"Matematika",  judul:"Turunan Fungsi Aljabar", tipe:"PDF",  ukuran:"1.8 MB", kelas:"X-A",   tgl:"2025-03-09", deskripsi:"Aturan turunan fungsi aljabar dan penerapannya.",        unduhan:22 },
];

const empty = { judul:"", mapel:"Matematika", kelas:"X-A", deskripsi:"" };
const pad   = (n) => String(n).padStart(2,"0");
const fmtTgl = (s) => { const [y,m,d]=s.split("-"); return `${d} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][+m-1]} ${y}`; };

export default function GuruMateriPage() {
  const [materi, setMateri] = useState(initMateri);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(empty);
  const [file,   setFile]   = useState(null);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState("Semua");

  const filtered = materi
    .filter(m => filter==="Semua" || m.mapel===filter)
    .sort((a,b) => b.tgl.localeCompare(a.tgl));

  const validate = () => {
    const e = {};
    if (!form.judul.trim())    e.judul    = "Wajib diisi";
    if (!form.deskripsi.trim())e.deskripsi= "Wajib diisi";
    if (!file)                 e.file     = "Pilih file";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const simpan = () => {
    if (!validate()) return;
    const today = new Date(2025,2,10);
    setMateri(p => [{
      id: Date.now(), ...form,
      tipe: file.name.split(".").pop().toUpperCase(),
      ukuran: `${(file.size/1024/1024).toFixed(1)} MB`,
      tgl: `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`,
      unduhan: 0,
    }, ...p]);
    setModal(false); setForm(empty); setFile(null); setErrors({});
  };

  const hapus = (id) => setMateri(p => p.filter(m=>m.id!==id));

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, animation:"slideUp 0.3s ease both" }}>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:"#18181B" }}>Upload Materi</p>
          <p style={{ fontSize:12, color:"#A1A1AA", marginTop:3 }}>{materi.length} materi diunggah</p>
        </div>
        <button onClick={()=>setModal(true)} style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#fff", background:"#6366F1", border:"none", cursor:"pointer" }}>
          <Plus size={15}/> Upload Materi
        </button>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {["Semua",...MAPEL].map(m=>(
          <button key={m} onClick={()=>setFilter(m)} style={{ fontSize:12, fontWeight:500, padding:"5px 12px", borderRadius:99, cursor:"pointer", border:"1px solid", background:filter===m?"#6366F1":"#fff", color:filter===m?"#fff":"#52525B", borderColor:filter===m?"#6366F1":"#E4E4E7" }}>{m}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {filtered.map(m => {
          const w = warnaMeta[m.mapel]||"#6366F1";
          return (
            <div key={m.id} style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:16, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", padding:18, display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:11, background:w+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{iconMeta[m.mapel]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:"2px 7px", borderRadius:99, background:w+"18", color:w }}>{m.mapel}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:"2px 7px", borderRadius:99, background:"#F4F4F5", color:"#52525B" }}>{m.kelas}</span>
                  </div>
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:13.5, color:"#18181B", lineHeight:1.35 }}>{m.judul}</p>
                </div>
              </div>
              <p style={{ fontSize:12.5, color:"#52525B", lineHeight:1.6 }}>{m.deskripsi}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid #F4F4F5", marginTop:"auto" }}>
                <div>
                  <p style={{ fontSize:11.5, color:"#52525B" }}>{m.tipe} · {m.ukuran} · {fmtTgl(m.tgl)}</p>
                  <p style={{ fontSize:11, color:"#A1A1AA", marginTop:2 }}>⬇ {m.unduhan} unduhan</p>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={{ width:30, height:30, borderRadius:7, border:"1px solid #E4E4E7", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <Eye size={13} style={{ color:"#52525B" }}/>
                  </button>
                  <button onClick={()=>hapus(m.id)} style={{ width:30, height:30, borderRadius:7, border:"1px solid #FEE2E2", background:"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <Trash2 size={13} style={{ color:"#DC2626" }}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload modal */}
      {modal && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(3px)" }}>
          <div style={{ background:"#fff", borderRadius:16, padding:24, width:"100%", maxWidth:460, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", animation:"slideUp 0.2s ease", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:"#18181B" }}>Upload Materi Baru</p>
              <button onClick={()=>{setModal(false);setFile(null);setErrors({});}} style={{ width:28,height:28,borderRadius:7,border:"1px solid #E4E4E7",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <X size={13} style={{ color:"#A1A1AA" }}/>
              </button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {/* File drop */}
              <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"20px 16px", borderRadius:12, cursor:"pointer", border:`2px dashed ${errors.file?"#DC2626":file?"#6366F1":"#E4E4E7"}`, background:file?"#EEF2FF":"#F7F7F5" }}>
                {file ? (
                  <><FileText size={22} style={{ color:"#6366F1" }}/><p style={{ fontSize:13, fontWeight:600, color:"#6366F1" }}>{file.name}</p><p style={{ fontSize:11, color:"#A1A1AA" }}>{(file.size/1024).toFixed(0)} KB</p></>
                ) : (
                  <><Paperclip size={22} style={{ color:"#A1A1AA" }}/><p style={{ fontSize:13, fontWeight:500, color:"#18181B" }}>Klik untuk pilih file</p><p style={{ fontSize:11, color:"#A1A1AA" }}>PDF, DOCX, PPT — maks. 20 MB</p></>
                )}
                <input type="file" style={{ display:"none" }} onChange={e=>setFile(e.target.files[0])}/>
              </label>
              {errors.file && <p style={{ fontSize:11, color:"#DC2626", marginTop:-8 }}>{errors.file}</p>}

              {[["Judul Materi","judul"],["Deskripsi","deskripsi"]].map(([lbl,key])=>(
                <div key={key}>
                  <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>{lbl}</p>
                  {key==="deskripsi"?(
                    <textarea value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} rows={2}
                      style={{ width:"100%", fontSize:13, padding:"8px 10px", borderRadius:9, border:`1px solid ${errors[key]?"#DC2626":"#E4E4E7"}`, background:"#F7F7F5", color:"#18181B", resize:"none", outline:"none", fontFamily:"'DM Sans',sans-serif" }}/>
                  ):(
                    <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                      style={{ width:"100%", fontSize:13, padding:"8px 10px", borderRadius:9, border:`1px solid ${errors[key]?"#DC2626":"#E4E4E7"}`, background:"#F7F7F5", color:"#18181B", fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
                  )}
                  {errors[key] && <p style={{ fontSize:11, color:"#DC2626", marginTop:3 }}>{errors[key]}</p>}
                </div>
              ))}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[["Mata Pelajaran","mapel",MAPEL],["Kelas","kelas",KELAS.filter(k=>k!=="Semua Kelas")]].map(([lbl,key,opts])=>(
                  <div key={key}>
                    <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>{lbl}</p>
                    <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                      style={{ width:"100%", fontSize:13, padding:"8px 10px", borderRadius:9, border:"1px solid #E4E4E7", background:"#F7F7F5", color:"#18181B", fontFamily:"'DM Sans',sans-serif", outline:"none" }}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <button onClick={simpan} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 0", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#fff", background:"#6366F1", border:"none", cursor:"pointer" }}>
                <Upload size={14}/> Upload Materi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}