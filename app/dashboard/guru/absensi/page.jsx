"use client";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* CONFIG */

const statusCfg = {
  hadir: { label: "Hadir", icon: CheckCircle2, c: "#16A34A", bg: "#DCFCE7" },
  terlambat: { label: "Terlambat", icon: Clock, c: "#EA580C", bg: "#FFEDD5" },
  sakit: { label: "Sakit", icon: AlertCircle, c: "#D97706", bg: "#FEF9C3" },
  izin: { label: "Izin", icon: Clock, c: "#6366F1", bg: "#EEF2FF" },
  alpha: { label: "Alpha", icon: XCircle, c: "#DC2626", bg: "#FEE2E2" },
};

const siswaList = [
  "Andi Wijaya",
  "Budi Santoso",
  "Citra Dewi",
  "Dian Pratama",
  "Eka Rahayu",
  "Fajar Nugraha",
  "Gita Permata",
  "Hendra Kusuma",
  "Indah Lestari",
  "Joko Santoso",
  "Kartika Sari",
  "Luki Pratama",
  "Maya Putri",
  "Nanda Rizki",
  "Ogi Firmansyah",
  "Putri Anggraini",
  "Qori Amalia",
  "Reza Pahlevy",
  "Sinta Dewi",
  "Teguh Wibowo",
  "Umi Kalsum",
  "Vino Rizaldi",
  "Wulan Sari",
  "Xena Cahya",
  "Yandi Prasetyo",
  "Zara Amelia",
  "Aditya Nugraha",
  "Bagas Ardianto",
  "Cindy Aulia",
  "Dani Setiawan",
  "Elsa Novitasari",
  "Fandi Akbar",
];

const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/* HELPERS */

const pad = (n) => String(n).padStart(2, "0");
const makeKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const defaultStatus = () =>
  Object.fromEntries(siswaList.map((n) => [n, "hadir"]));

export default function GuruAbsensiPage() {
  const TY = 2025,
    TM = 2,
    TD = 10;
  const todayKey = makeKey(TY, TM, TD);

  const [vy, setVy] = useState(TY);
  const [vm, setVm] = useState(TM);

  const [selDate, setSelDate] = useState(todayKey);

  const [records, setRecords] = useState({});

  const [draft, setDraft] = useState({
    kelas: "X-A",
    mapel: "Matematika",
    jam: "07.00–08.30",
    status: defaultStatus(),
  });

  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  /* SAVE */

  const handleSave = () => {
    setRecords((p) => ({ ...p, [selDate]: { ...draft } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* BULK */

  const setOne = (nama, s) => {
    setDraft((p) => ({ ...p, status: { ...p.status, [nama]: s } }));
  };

  /* CALENDAR */

  const firstDow = new Date(vy, vm, 1).getDay();
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();

  const prevMonth = () =>
    vm === 0 ? (setVy((y) => y - 1), setVm(11)) : setVm((m) => m - 1);
  const nextMonth = () =>
    vm === 11 ? (setVy((y) => y + 1), setVm(0)) : setVm((m) => m + 1);

  const isToday = (dk) => dk === todayKey;

  const switchDate = (dk) => {
    setSelDate(dk);
    setDraft({
      kelas: "X-A",
      mapel: "Matematika",
      jam: "07.00–08.30",
      status: defaultStatus(),
    });
  };

  /* SUMMARY */

  const counts = Object.values(draft.status).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  /* SEARCH */

  const filteredSiswa = siswaList.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase()),
  );

  /* DATE LABEL */

  const labelFromKey = (k) => {
    const [y, m, d] = k.split("-").map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    const HARI = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return `${HARI[dow]}, ${d} ${BULAN_ID[m - 1]} ${y}`;
  };

  return (
    <div className="p-4 md:p-6 lg:p-7 h-full flex flex-col gap-5">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <p className="text-xl font-bold">Input Absensi</p>
          <p className="text-sm text-zinc-400">
            Klik tanggal pada kalender untuk input atau edit absensi
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold ${saved ? "bg-green-600" : "bg-indigo-500"}`}
        >
          <Save size={14} />
          {saved ? "Tersimpan" : "Simpan Absensi"}
        </button>
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4 items-start flex-1 min-h-0">
        {/* CALENDAR */}

        <div className="bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <button onClick={prevMonth}>
              <ChevronLeft size={16} />
            </button>

            <p className="font-semibold">
              {BULAN_ID[vm]} {vy}
            </p>

            <button onClick={nextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-xs text-zinc-400 font-bold mb-2">
            {DAYS_SHORT.map((d) => (
              <p key={d} className="text-center">
                {d}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={i} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const dk = makeKey(vy, vm, d);

              return (
                <button
                  key={d}
                  onClick={() => switchDate(dk)}
                  className={`aspect-square rounded-md text-xs flex items-center justify-center
${dk === selDate ? "bg-indigo-500 text-white" : "hover:bg-zinc-100"}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="flex flex-col gap-4 h-full min-h-0">
          {/* DATE */}

          <div className="bg-white border rounded-xl p-4">
            <p className="font-bold text-sm">{labelFromKey(selDate)}</p>

            {isToday(selDate) && (
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                Hari Ini
              </span>
            )}
          </div>

          {/* SEARCH + SUMMARY */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Summary */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCfg).map(([k, cfg]) => {
                const Icon = cfg.icon;

                return (
                  <div
                    key={k}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold"
                    style={{ background: cfg.bg, color: cfg.c }}
                  >
                    <Icon size={12} />
                    {counts[k] || 0} {cfg.label}
                  </div>
                );
              })}
            </div>
            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa..."
              className="border rounded-lg px-3 py-2 text-sm w-full md:w-64"
            />
          </div>

          {/* STUDENT LIST */}

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
            {filteredSiswa.map((nama) => {
              const st = draft.status[nama] || "hadir";
              const cfg = statusCfg[st];

              return (
                <div
                  key={nama}
                  className="flex items-center gap-3 border rounded-xl px-3 py-2 bg-white"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ background: cfg.bg, color: cfg.c }}
                  >
                    {nama.charAt(0)}
                  </div>

                  <p className="flex-1 text-sm">{nama}</p>

                  <div className="flex gap-1">
                    {Object.entries(statusCfg).map(([k, c2]) => {
                      const Icon = c2.icon;
                      const active = st === k;

                      return (
                        <div className="relative group" key={k}>
                          <div className="relative group">
                            <button
                              onClick={() => setOne(nama, k)}
                              className="w-7 h-7 flex items-center justify-center rounded-md border cursor-pointer"
                              style={{
                                borderColor: active ? c2.c : "#ddd",
                                background: active ? c2.bg : "#fff",
                              }}
                            >
                              <Icon size={12} style={{ color: c2.c }} />
                            </button>

                            <div
                              className="
absolute bottom-full -mb-3 left-1/2 -translate-x-1/2
px-2 py-1 text-[10px] rounded bg-zinc-800 text-white
opacity-0 group-hover:opacity-100
pointer-events-none whitespace-nowrap
transition
z-100
"
                            >
                              {c2.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
