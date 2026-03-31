"use client";
import { useState } from "react";
import { Plus, Trash2, Megaphone, X, ChevronDown } from "lucide-react";

const KELAS_OPT = ["Semua Kelas","X-A","X-B","XI-IPA","XI-IPS","XII-IPA"];

const initData = [
  { id:1, judul:"Jadwal UTS Semester Genap 2024/2025", isi:"UTS akan dilaksanakan pada tanggal 24–28 Maret 2025. Siswa wajib hadir tepat waktu dan membawa kartu ujian.", target:"Semua Kelas", tgl:"2025-03-10", prioritas:"tinggi" },
  { id:2, judul:"Pengumpulan Laporan Fisika",          isi:"Laporan praktikum gelombang dikumpulkan paling lambat Jumat, 14 Maret 2025 pukul 23:59.",                     target:"X-A",         tgl:"2025-03-08", prioritas:"sedang" },
  { id:3, judul:"Remedial Matematika",                 isi:"Remedial ulangan harian bab Integral akan diadakan Rabu, 12 Maret 2025 pukul 14.00 di ruang R.12.",           target:"X-A",         tgl:"2025-03-07", prioritas:"sedang" },
  { id:4, judul:"Libur Hari Nyepi",                   isi:"Sekolah libur pada tanggal 29 Maret 2025 dalam rangka Hari Raya Nyepi.",                                       target:"Semua Kelas", tgl:"2025-03-05", prioritas:"rendah" },
];

const priCfg = {
  tinggi: { label:"Penting",  c:"#DC2626", bg:"#FEE2E2" },
  sedang: { label:"Info",     c:"#D97706", bg:"#FEF9C3" },
  rendah: { label:"Umum",     c:"#6366F1", bg:"#EEF2FF" },
};

const pad    = (n) => String(n).padStart(2,"0");
const fmtTgl = (s) => { const [y,m,d]=s.split("-"); return `${d} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][+m-1]} ${y}`; };

const empty = { judul:"", isi:"", target:"Semua Kelas", prioritas:"sedang" };

export default function GuruPengumumanPage() {
  const [list,  setList]  = useState(initData);
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState(empty);
  const [errors,setErrors]= useState({});

  const validate = () => {
    const e = {};
    if (!form.judul.trim()) e.judul = "Wajib diisi";
    if (!form.isi.trim())   e.isi   = "Wajib diisi";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const simpan = () => {
    if (!validate()) return;
    const today = new Date(2025,2,10);
    setList(p=>[{ id:Date.now(), ...form, tgl:`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}` },...p]);
    setModal(false); setForm(empty); setErrors({});
  };

  const sel = (key, opts) => (
    <div style={{ position:"relative" }}>
      <select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
        style={{ appearance:"none", width:"100%", fontSize:13, padding:"8px 28px 8px 10px", borderRadius:9, border:"1px solid #E4E4E7", background:"#F7F7F5", color:"#18181B", fontFamily:"'DM Sans',sans-serif", outline:"none", cursor:"pointer" }}>
        {opts.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", color:"#A1A1AA", pointerEvents:"none" }}/>
    </div>
  );

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, animation:"slideUp 0.3s ease both" }}>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:20, color:"#18181B" }}>Pengumuman</p>
          <p style={{ fontSize:12, color:"#A1A1AA", marginTop:3 }}>{list.length} pengumuman aktif</p>
        </div>
        <button onClick={()=>setModal(true)} style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 18px", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#fff", background:"#6366F1", border:"none", cursor:"pointer" }}>
          <Plus size={15}/> Buat Pengumuman
        </button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {list.map(p=>{
          const cfg = priCfg[p.prioritas];
          return (
            <div key={p.id} style={{ background:"#fff", border:"1px solid #E4E4E7", borderRadius:14, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", padding:"18px 20px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:11, background:cfg.bg, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Megaphone size={18} style={{ color:cfg.c }}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:99, background:cfg.bg, color:cfg.c }}>{cfg.label}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:99, background:"#F4F4F5", color:"#52525B" }}>{p.target}</span>
                    <span style={{ fontSize:11, color:"#A1A1AA" }}>· {fmtTgl(p.tgl)}</span>
                  </div>
                  <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, color:"#18181B", marginBottom:8 }}>{p.judul}</p>
                  <p style={{ fontSize:13.5, color:"#52525B", lineHeight:1.7 }}>{p.isi}</p>
                </div>
                <button onClick={()=>setList(prev=>prev.filter(x=>x.id!==p.id))} style={{ width:30, height:30, borderRadius:7, border:"1px solid #FEE2E2", background:"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                  <Trash2 size={13} style={{ color:"#DC2626" }}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(3px)" }}>
          <div style={{ background:"#fff", borderRadius:16, padding:24, width:"100%", maxWidth:460, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", animation:"slideUp 0.2s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:"#18181B" }}>Buat Pengumuman</p>
              <button onClick={()=>{setModal(false);setErrors({});}} style={{ width:28,height:28,borderRadius:7,border:"1px solid #E4E4E7",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <X size={13} style={{ color:"#A1A1AA" }}/>
              </button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {[["Judul Pengumuman","judul"],["Isi Pengumuman","isi"]].map(([lbl,key])=>(
                <div key={key}>
                  <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>{lbl}</p>
                  {key==="isi"?(
                    <textarea value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} rows={4} placeholder={key==="isi"?"Tulis isi pengumuman...":""}
                      style={{ width:"100%", fontSize:13, padding:"8px 10px", borderRadius:9, border:`1px solid ${errors[key]?"#DC2626":"#E4E4E7"}`, background:"#F7F7F5", color:"#18181B", resize:"none", outline:"none", fontFamily:"'DM Sans',sans-serif" }}/>
                  ):(
                    <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}
                      style={{ width:"100%", fontSize:13, padding:"8px 10px", borderRadius:9, border:`1px solid ${errors[key]?"#DC2626":"#E4E4E7"}`, background:"#F7F7F5", color:"#18181B", fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
                  )}
                  {errors[key] && <p style={{ fontSize:11, color:"#DC2626", marginTop:3 }}>{errors[key]}</p>}
                </div>
              ))}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>Target Kelas</p>
                  {sel("target", KELAS_OPT)}
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:"#52525B", marginBottom:5 }}>Prioritas</p>
                  {sel("prioritas",[{value:"tinggi",label:"Penting"},{value:"sedang",label:"Info"},{value:"rendah",label:"Umum"}])}
                </div>
              </div>
              <button onClick={simpan} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 0", borderRadius:10, fontSize:13.5, fontWeight:600, color:"#fff", background:"#6366F1", border:"none", cursor:"pointer" }}>
                <Megaphone size={14}/> Kirim Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}