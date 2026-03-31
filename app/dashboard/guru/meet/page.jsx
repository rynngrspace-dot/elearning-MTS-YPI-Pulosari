"use client";
import { useState } from "react";
import { Video, Copy, Check, Plus, Trash2, X, ChevronDown, ExternalLink } from "lucide-react";

const KELAS = ["X-A","X-B","XI-IPA","XI-IPS","XII-IPA"];
const PLATFORM = ["Google Meet","Zoom","Microsoft Teams"];

const initSesi = [
  { id:1, judul:"Review UTS Matematika",    platform:"Google Meet", kelas:"X-A",    tgl:"2025-03-11", jam:"14.00", link:"https://meet.google.com/abc-defg-hij", status:"upcoming" },
  { id:2, judul:"Diskusi Laporan Fisika",   platform:"Zoom",        kelas:"X-A",    tgl:"2025-03-13", jam:"13.00", link:"https://zoom.us/j/123456789",          status:"upcoming" },
  { id:3, judul:"Bimbingan Kelompok Kimia", platform:"Google Meet", kelas:"XI-IPA", tgl:"2025-03-08", jam:"15.00", link:"https://meet.google.com/xyz-uvwx-yz",  status:"selesai"  },
];

const platCfg = {
  "Google Meet":     { c:"#16A34A", bg:"#DCFCE7", emoji:"📹" },
  "Zoom":            { c:"#2563EB", bg:"#DBEAFE", emoji:"💻" },
  "Microsoft Teams": { c:"#7C3AED", bg:"#EDE9FE", emoji:"🟦" },
};

const fmtTgl = (s) => { const [y,m,d]=s.split("-"); return `${d} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][+m-1]} ${y}`; };
const pad    = (n) => String(n).padStart(2,"0");
const empty  = { judul:"", platform:"Google Meet", kelas:"X-A", tgl:"", jam:"", link:"" };

export default function GuruMeetPage() {
  const [sesi,   setSesi]   = useState(initSesi);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(null);

  const copyLink = (id, link) => {
    navigator.clipboard?.writeText(link).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null),2000);
  };

  const validate = () => {
    const e = {};
    if (!form.judul.trim()) e.judul = "Wajib diisi";
    if (!form.tgl)          e.tgl   = "Wajib diisi";
    if (!form.jam.trim())   e.jam   = "Wajib diisi";
    if (!form.link.trim())  e.link  = "Wajib diisi";
    setErrors(e); return !Object.keys(e).length;
  };

  const simpan = () => {
    if (!validate()) return;
    const t = new Date(2025,2,10);
    setSesi(p=>[...p,{ id:Date.now(),...form, status:"upcoming" }]);
    setModal(false); setForm(empty); setErrors({});
  };

  const upcoming = sesi.filter(s=>s.status==="upcoming").sort((a,b)=>a.tgl.localeCompare(b.tgl));
  const selesai  = sesi.filter(s=>s.status==="selesai");

  const SesiCard = ({ s }) => {
    const cfg = platCfg[s.platform]||{ c:"#6366F1",bg:"#EEF2FF",emoji:"📹" };
    return (
      <div style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", padding:"16px 18px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <div style={{ width:44,height:44,borderRadius:12,background:cfg.bg,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{cfg.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
              <span style={{ fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:cfg.bg,color:cfg.c }}>{s.platform}</span>
              <span style={{ fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"#F4F4F5",color:"#52525B" }}>Kelas {s.kelas}</span>
              {s.status==="selesai" && <span style={{ fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"#DCFCE7",color:"#16A34A" }}>✓ Selesai</span>}
            </div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:"#18181B",marginBottom:5 }}>{s.judul}</p>
            <p style={{ fontSize:12,color:"#A1A1AA",marginBottom:10 }}>📅 {fmtTgl(s.tgl)} · 🕐 {s.jam} WIB</p>
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:9,background:"#F7F7F5",border:"1px solid #E4E4E7" }}>
              <p style={{ flex:1,fontSize:12,color:"#52525B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.link}</p>
              <button onClick={()=>copyLink(s.id,s.link)} style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:11.5,fontWeight:600,padding:"4px 10px",borderRadius:7,border:"none",background:copied===s.id?"#DCFCE7":"#6366F1",color:copied===s.id?"#16A34A":"#fff",cursor:"pointer",flexShrink:0,transition:"all 0.15s" }}>
                {copied===s.id?<><Check size={11}/>Tersalin!</>:<><Copy size={11}/>Salin</>}
              </button>
              <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:7,background:"#E8F8F7",textDecoration:"none" }}>
                <ExternalLink size={12} style={{ color:"#0EA5A0" }}/>
              </a>
            </div>
          </div>
          <button onClick={()=>setSesi(p=>p.filter(x=>x.id!==s.id))} style={{ width:28,height:28,borderRadius:7,border:"1px solid #FEE2E2",background:"#FEF2F2",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
            <Trash2 size={12} style={{ color:"#DC2626" }}/>
          </button>
        </div>
      </div>
    );
  };

  const inputStyle = (err) => ({ width:"100%",fontSize:13,padding:"8px 10px",borderRadius:9,border:`1px solid ${err?"#DC2626":"#E4E4E7"}`,background:"#F7F7F5",color:"#18181B",fontFamily:"'DM Sans',sans-serif",outline:"none" });

  return (
    <div style={{ padding:28,display:"flex",flexDirection:"column",gap:20,animation:"slideUp 0.3s ease both" }}>

      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:20,color:"#18181B" }}>Sesi Online</p>
          <p style={{ fontSize:12,color:"#A1A1AA",marginTop:3 }}>{upcoming.length} sesi mendatang</p>
        </div>
        <button onClick={()=>setModal(true)} style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:10,fontSize:13.5,fontWeight:600,color:"#fff",background:"#6366F1",border:"none",cursor:"pointer" }}>
          <Plus size={15}/> Tambah Sesi
        </button>
      </div>

      {upcoming.length > 0 && (
        <div>
          <p style={{ fontSize:10.5,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#A1A1AA",marginBottom:10 }}>Mendatang</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {upcoming.map(s=><SesiCard key={s.id} s={s}/>)}
          </div>
        </div>
      )}

      {selesai.length > 0 && (
        <div>
          <p style={{ fontSize:10.5,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"#A1A1AA",marginBottom:10 }}>Selesai</p>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {selesai.map(s=><SesiCard key={s.id} s={s}/>)}
          </div>
        </div>
      )}

      {modal && (
        <div style={{ position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(3px)" }}>
          <div style={{ background:"#fff",borderRadius:16,padding:24,width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,0.18)",animation:"slideUp 0.2s ease" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:16,color:"#18181B" }}>Tambah Sesi Online</p>
              <button onClick={()=>{setModal(false);setErrors({});}} style={{ width:28,height:28,borderRadius:7,border:"1px solid #E4E4E7",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <X size={13} style={{ color:"#A1A1AA" }}/>
              </button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
              <div>
                <p style={{ fontSize:12,fontWeight:500,color:"#52525B",marginBottom:5 }}>Judul Sesi</p>
                <input value={form.judul} onChange={e=>setForm(p=>({...p,judul:e.target.value}))} style={inputStyle(errors.judul)}/>
                {errors.judul && <p style={{ fontSize:11,color:"#DC2626",marginTop:3 }}>{errors.judul}</p>}
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                {[["Platform","platform",PLATFORM],["Kelas","kelas",KELAS]].map(([lbl,key,opts])=>(
                  <div key={key}>
                    <p style={{ fontSize:12,fontWeight:500,color:"#52525B",marginBottom:5 }}>{lbl}</p>
                    <div style={{ position:"relative" }}>
                      <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                        style={{ appearance:"none",width:"100%",fontSize:13,padding:"8px 28px 8px 10px",borderRadius:9,border:"1px solid #E4E4E7",background:"#F7F7F5",color:"#18181B",fontFamily:"'DM Sans',sans-serif",outline:"none" }}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={11} style={{ position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",color:"#A1A1AA",pointerEvents:"none" }}/>
                    </div>
                  </div>
                ))}
                <div>
                  <p style={{ fontSize:12,fontWeight:500,color:"#52525B",marginBottom:5 }}>Tanggal</p>
                  <input type="date" value={form.tgl} onChange={e=>setForm(p=>({...p,tgl:e.target.value}))} style={inputStyle(errors.tgl)}/>
                  {errors.tgl && <p style={{ fontSize:11,color:"#DC2626",marginTop:3 }}>{errors.tgl}</p>}
                </div>
                <div>
                  <p style={{ fontSize:12,fontWeight:500,color:"#52525B",marginBottom:5 }}>Jam (WIB)</p>
                  <input value={form.jam} onChange={e=>setForm(p=>({...p,jam:e.target.value}))} placeholder="14.00" style={inputStyle(errors.jam)}/>
                  {errors.jam && <p style={{ fontSize:11,color:"#DC2626",marginTop:3 }}>{errors.jam}</p>}
                </div>
              </div>
              <div>
                <p style={{ fontSize:12,fontWeight:500,color:"#52525B",marginBottom:5 }}>Link Meeting</p>
                <input value={form.link} onChange={e=>setForm(p=>({...p,link:e.target.value}))} placeholder="https://meet.google.com/..." style={inputStyle(errors.link)}/>
                {errors.link && <p style={{ fontSize:11,color:"#DC2626",marginTop:3 }}>{errors.link}</p>}
              </div>
              <button onClick={simpan} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px 0",borderRadius:10,fontSize:13.5,fontWeight:600,color:"#fff",background:"#6366F1",border:"none",cursor:"pointer" }}>
                <Video size={14}/> Simpan Sesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}