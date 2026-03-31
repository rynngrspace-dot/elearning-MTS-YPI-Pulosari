"use client";
import { useState } from "react";
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
  Paperclip,
  ChevronDown,
} from "lucide-react";

/* ── Data ───────────────────────────────────── */
const daftarTugas = [
  {
    id: 1,
    mapel: "Matematika",
    warna: "#0EA5A0",
    judul: "Latihan Soal Integral",
    guru: "Pak Hendra",
    deadline: "Besok, 23:59",
    deskripsi:
      "Kerjakan soal integral hal. 45–47 buku paket. Upload dalam format PDF.",
    status: "belum",
    poin: 100,
  },
  {
    id: 2,
    mapel: "Matematika",
    warna: "#0EA5A0",
    judul: "Kuis Turunan Fungsi",
    guru: "Pak Hendra",
    deadline: "Kamis, 23:59",
    deskripsi: "Kerjakan 10 soal turunan fungsi aljabar.",
    status: "belum",
    poin: 50,
  },
  {
    id: 3,
    mapel: "Fisika",
    warna: "#F59E0B",
    judul: "Laporan Praktikum Gelombang",
    guru: "Pak Rudi",
    deadline: "Jum'at, 23:59",
    deskripsi: "Buat laporan praktikum sesuai format.",
    status: "belum",
    poin: 100,
  },
  {
    id: 4,
    mapel: "Fisika",
    warna: "#F59E0B",
    judul: "Rangkuman Bab Cahaya",
    guru: "Pak Rudi",
    deadline: "Senin, 23:59",
    deskripsi: "Buat rangkuman materi cahaya.",
    status: "dinilai",
    poin: 50,
    nilaiDapat: 45,
  },
  {
    id: 5,
    mapel: "B. Indonesia",
    warna: "#6366F1",
    judul: "Esai Argumentatif",
    guru: "Bu Sari",
    deadline: "Senin, 23:59",
    deskripsi: "Tulis esai 500 kata.",
    status: "dikumpulkan",
    poin: 100,
  },
];

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

/* group mapel */
const grouped = daftarTugas.reduce((acc, t) => {
  (acc[t.mapel] ??= { warna: t.warna, items: [] }).items.push(t);
  return acc;
}, {});

export default function TugasPage() {
  const [open, setOpen] = useState({ [Object.keys(grouped)[0]]: true });
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [submitted, setSubmitted] = useState([]);

  const toggle = (mapel) => setOpen((p) => ({ ...p, [mapel]: !p[mapel] }));

  const submit = (id) => {
    setSubmitted((p) => [...p, id]);
    setSelected(null);
    setFile(null);
    setCatatan("");
  };

  const totalBelum = daftarTugas.filter(
    (t) => !submitted.includes(t.id) && t.status === "belum",
  ).length;

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Daftar Tugas</h1>

          <p className="text-xs text-zinc-400 mt-1">
            {totalBelum} tugas belum dikumpulkan · {Object.keys(grouped).length}{" "}
            mata pelajaran
          </p>
        </div>

        {totalBelum > 0 && (
          <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600">
            <AlertCircle size={12} /> {totalBelum} pending
          </span>
        )}
      </div>

      {/* ACCORDION */}

      <div className="flex flex-col gap-3">
        {Object.entries(grouped).map(([mapel, { warna, items }]) => {
          const isOpen = open[mapel];
          const belum = items.filter(
            (t) => !submitted.includes(t.id) && t.status === "belum",
          ).length;

          return (
            <div
              key={mapel}
              className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* HEADER */}
              <button
                onClick={() => toggle(mapel)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 transition"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: warna }}
                />

                <p className="flex-1 text-left font-semibold text-sm text-zinc-900">
                  {mapel}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">
                    {items.length} tugas
                  </span>

                  {belum > 0 ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                      {belum} belum
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                      ✓ selesai
                    </span>
                  )}
                </div>

                <ChevronDown
                  size={16}
                  className={`text-zinc-400 transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* BODY */}

              {isOpen && (
                <div className="flex flex-col">
                  {items.map((tugas, idx) => {
                    const st = submitted.includes(tugas.id)
                      ? "dikumpulkan"
                      : tugas.status;
                    const cfg = statusCfg[st];
                    const Icon = cfg.icon;

                    return (
                      <div
                        key={tugas.id}
                        className="flex gap-4 px-5 py-4 border-t border-zinc-100"
                      >
                        <div
                          className="w-1 rounded"
                          style={{ background: warna }}
                        />

                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span
                              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.c}`}
                            >
                              <Icon size={10} /> {cfg.label}
                            </span>

                            {st === "dinilai" && (
                              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">
                                Nilai {tugas.nilaiDapat}/{tugas.poin}
                              </span>
                            )}
                          </div>

                          <p className="font-semibold text-sm text-zinc-900">
                            {tugas.judul}
                          </p>

                          <p className="text-xs text-zinc-400 mb-1">
                            {tugas.guru} · 🕐 Deadline : {tugas.deadline}
                          </p>

                          <p className="text-sm text-zinc-600">
                            {tugas.deskripsi}
                          </p>
                        </div>

                        {st === "belum" && (
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
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700">
                  {selected.mapel}
                </span>

                <h2 className="font-bold mt-2">{selected.judul}</h2>

                <p className="text-xs text-zinc-400">
                  {selected.guru} · deadline : {selected.deadline}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center border rounded-lg cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <label className="border-2 border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50">
              {file ? (
                <>
                  <FileText size={24} className="text-teal-500" />
                  <p className="text-sm font-semibold text-teal-600">
                    {file.name}
                  </p>
                </>
              ) : (
                <>
                  <Paperclip size={24} className="text-zinc-400" />
                  <p className="text-sm">Klik untuk upload file</p>
                </>
              )}

              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan untuk guru..."
              className="w-full mt-3 p-3 text-sm border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />

            <button
              disabled={!file}
              onClick={() => submit(selected.id)}
              className="w-full mt-4 py-2 font-semibold text-white bg-teal-500 rounded-lg disabled:opacity-40 cursor-pointer"
            >
              <Upload size={14} className="inline mr-1" />
              Kumpulkan Tugas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
