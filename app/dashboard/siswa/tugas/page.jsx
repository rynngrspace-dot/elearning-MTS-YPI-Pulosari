"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
  Paperclip,
  ChevronDown,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getStudentTugasPageAction, submitTugasAction } from "@/lib/actions/siswa-actions";
import { getSubjectDetailAction } from "@/lib/actions/pengampu-actions";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

const statusCfg = {
  belum: {
    label: "Belum Dikumpulkan",
    c: "text-red-600",
    bg: "bg-red-50",
    icon: AlertCircle,
  },
  dikumpulkan: {
    label: "Menunggu Penilaian",
    c: "text-yellow-600",
    bg: "bg-yellow-50",
    icon: Clock,
  },
  dinilai: {
    label: "Sudah Dinilai",
    c: "text-green-600",
    bg: "bg-green-50",
    icon: CheckCircle2,
  },
};

const getMapelStyle = (mapelName) => {
    const name = mapelName.toLowerCase();
    if (name.includes("matematika") || name.includes("ipa")) return "#0EA5A0";
    if (name.includes("islam") || name.includes("agama") || name.includes("fikih") || name.includes("hadits")) return "#F59E0B";
    if (name.includes("indonesia") || name.includes("inggris") || name.includes("arab")) return "#6366F1";
    if (name.includes("informatika")) return "#8B5CF6";
    return "#EC4899";
};

export default function TugasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapelIdFilter = searchParams.get("id");

  const [data, setData] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({});
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (user?.studentId && user?.kelasId) {
      // Fetch tasks
      const res = await getStudentTugasPageAction(user.studentId, user.kelasId);
      if (res.success) setData(res.data);

      // Fetch subject name if strictly filtered
      if (mapelIdFilter) {
        const sRes = await getSubjectDetailAction(user.kelasId, mapelIdFilter);
        if (sRes.success && sRes.data) {
           setSubjectName(sRes.data.mapel.nama);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, mapelIdFilter]);

  // Handle Mapel filter from URL
  useEffect(() => {
    if (mapelIdFilter && data.length > 0) {
        setOpen({}); // Reset all
        const target = data.find(t => t.mapelId === mapelIdFilter);
        if (target) {
            setOpen({ [target.mapel.nama]: true });
        }
    }
  }, [mapelIdFilter, data]);

  const grouped = useMemo(() => {
    // Apply strict filtering if mapelIdFilter is present
    const filteredData = mapelIdFilter 
      ? data.filter(t => t.mapelId === mapelIdFilter)
      : data;

    return filteredData.reduce((acc, t) => {
      const mapelName = t.mapel.nama;
      (acc[mapelName] ??= { warna: getMapelStyle(mapelName), items: [] }).items.push(t);
      return acc;
    }, {});
  }, [data, mapelIdFilter]);

  useEffect(() => {
      if (Object.keys(grouped).length > 0 && Object.keys(open).length === 0) {
          setOpen({ [Object.keys(grouped)[0]]: true });
      }
  }, [grouped]);

  const toggle = (mapel) => setOpen((p) => ({ ...p, [mapel]: !p[mapel] }));

  // Header Title with Mapel Name
  const currentMapelName = useMemo(() => {
    if (mapelIdFilter) {
      return subjectName || data.find(t => t.mapelId === mapelIdFilter)?.mapel.nama || "";
    }
    return "";
  }, [mapelIdFilter, subjectName, data]);

  const handleSubmit = async () => {
    if (!selected || !user?.studentId) return;
    setSubmitting(true);
    
    // In a real app we'd upload the file first and get a URL.
    // Here we'll simulate the URL since the backend field expects a string.
    const fakeFileUrl = file ? `/uploads/submissions/${file.name}` : null;

    const res = await submitTugasAction({
      tugasId: selected.id,
      studentId: user.studentId,
      fileUrl: fakeFileUrl
    });

    if (res.success) {
      toast({
        title: "Berhasil",
        description: "Tugas berhasil dikumpulkan!",
        variant: "success"
      });
      fetchTugas(); // Refresh data
      setSelected(null);
      setFile(null);
      setCatatan("");
    } else {
      toast({
        title: "Gagal",
        description: res.error || "Gagal mengumpulkan tugas",
        variant: "destructive"
      });
    }
    setSubmitting(false);
  };

  const totalBelum = useMemo(() => {
    const now = new Date();
    return data.filter(t => {
      const submission = t.submissions.length > 0;
      const isLate = t.dueDate && now > new Date(t.dueDate);
      return !submission && !isLate;
    }).length;
  }, [data]);

  if (loading) {
      return (
        <div className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo" />
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Sinkronisasi Tugas...</p>
        </div>
      );
  }

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">
      {/* HEADER */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink-3 hover:text-indigo transition-colors w-fit"
        >
          <ChevronLeft size={14} /> Kembali
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              Daftar Tugas {currentMapelName ? `(${currentMapelName})` : ""}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {totalBelum} tugas belum dikumpulkan untuk kelas {user?.kelas || "Anda"}
            </p>
          </div>

          {totalBelum > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600">
              <AlertCircle size={12} /> {totalBelum} pending
            </span>
          )}
        </div>
      </div>

      {/* ACCORDION */}
      <div className="flex flex-col gap-3">
        {Object.entries(grouped).map(([mapel, { warna, items }]) => {
          const isOpen = open[mapel];
          const now = new Date();
          const belumCount = items.filter(t => {
            const submission = t.submissions.length > 0;
            const isLate = t.dueDate && now > new Date(t.dueDate);
            return !submission && !isLate;
          }).length;

          return (
            <div
              key={mapel}
              className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(mapel)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: warna }} />
                <p className="flex-1 text-left font-semibold text-sm text-zinc-900">{mapel}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{items.length} tugas</span>
                  {belumCount > 0 ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      {belumCount} belum
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">✓ selesai</span>
                  )}
                </div>
                <ChevronDown size={16} className={`text-zinc-400 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="flex flex-col">
                  {items.map((tugas) => {
                    const submission = tugas.submissions[0];
                    let st = "belum";
                    if (submission) {
                        st = submission.nilai !== null ? "dinilai" : "dikumpulkan";
                    }
                    const cfg = statusCfg[st];
                    const Icon = cfg.icon;

                    // Deadline logic
                    const now = new Date();
                    const deadline = tugas.dueDate ? new Date(tugas.dueDate) : null;
                    const isLate = deadline && now > deadline;

                    return (
                      <div key={tugas.id} className="flex gap-4 px-5 py-4 border-t border-zinc-100">
                        <div className="w-1 rounded" style={{ background: warna }} />
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.c}`}>
                              <Icon size={10} /> {cfg.label}
                            </span>
                            {st === "dinilai" && (
                              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">
                                Nilai {submission.nilai}/100
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-sm text-zinc-900">{tugas.judul}</p>
                          <p className="text-xs text-zinc-400 mb-1">
                            {tugas.teacher?.user?.name || "Guru"} · 🕐 Deadline : {tugas.dueDate ? new Date(tugas.dueDate).toLocaleString('id-ID') : "Tanpa Batas"}
                          </p>
                          <p className="text-sm text-zinc-600">{tugas.deskripsi || "Tidak ada deskripsi."}</p>
                        </div>

                        {st !== "belum" ? (
                           <button
                            disabled
                            className="flex items-center gap-1 h-fit px-4 py-2 text-sm font-semibold text-indigo bg-indigo/10 rounded-lg cursor-not-allowed opacity-70"
                           >
                             (Sudah Mengumpulkan)
                           </button>
                        ) : isLate ? (
                           <button
                             disabled
                             className="flex items-center gap-1 h-fit px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg cursor-not-allowed opacity-70"
                           >
                             (Tidak Mengumpulkan)
                           </button>
                        ) : (
                           <button
                             onClick={() => setSelected(tugas)}
                             className="flex items-center gap-1 h-fit px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition cursor-pointer"
                           >
                             <Upload size={14} /> Kumpulkan
                           </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-[slideUp_.2s_ease]">
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700">{selected.mapel.nama}</span>
                <h2 className="font-bold mt-2">{selected.judul}</h2>
                <p className="text-xs text-zinc-400">
                  {selected.teacher?.user?.name} · deadline : {selected.dueDate ? new Date(selected.dueDate).toLocaleString('id-ID') : "Tanpa Batas"}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-zinc-50">
                <X size={14} />
              </button>
            </div>

            <label className="border-2 border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-colors">
              {file ? (
                <>
                  <FileText size={24} className="text-teal-500" />
                  <p className="text-sm font-semibold text-teal-600 mt-2">{file.name}</p>
                </>
              ) : (
                <>
                  <Paperclip size={24} className="text-zinc-400" />
                  <p className="text-sm mt-2 text-zinc-500">Klik untuk upload file jawaban</p>
                </>
              )}
              <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
            </label>

            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan pengerjaan..."
              className="w-full mt-3 p-3 text-sm border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />

            <button
              disabled={!file || submitting}
              onClick={handleSubmit}
              className="w-full mt-4 py-2.5 font-semibold text-white bg-teal-500 rounded-lg disabled:opacity-40 hover:bg-teal-600 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {submitting ? "Mengirim..." : "Kumpulkan Tugas"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
