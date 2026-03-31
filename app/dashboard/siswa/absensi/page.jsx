"use client";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statusCfg = {
  hadir: { label: "Hadir", icon: CheckCircle2, c: "#16A34A", bg: "#DCFCE7" },
  sakit: { label: "Sakit", icon: AlertCircle, c: "#D97706", bg: "#FEF9C3" },
  izin: { label: "Izin", icon: Clock, c: "#6366F1", bg: "#EEF2FF" },
  alpha: { label: "Alpha", icon: XCircle, c: "#DC2626", bg: "#FEE2E2" },
  terlambat: { label: "Terlambat", icon: Clock, c: "#EA580C", bg: "#FFEDD5" },
};

const records = {
  "2025-03-10": [
    { jam: "07.00", mapel: "Matematika", status: "hadir" },
    { jam: "08.30", mapel: "B. Indonesia", status: "hadir" },
    { jam: "10.15", mapel: "Fisika", status: "hadir" },
    { jam: "12.30", mapel: "B. Inggris", status: "sakit" },
  ],
  "2025-03-09": [
    { jam: "07.00", mapel: "Matematika", status: "hadir" },
    { jam: "08.30", mapel: "Kimia", status: "hadir" },
    { jam: "10.15", mapel: "Sejarah", status: "terlambat" },
  ],
  "2025-03-08": [
    { jam: "07.00", mapel: "Matematika", status: "hadir" },
    { jam: "08.30", mapel: "B. Indonesia", status: "alpha" },
    { jam: "10.15", mapel: "Fisika", status: "hadir" },
  ],
  "2025-03-07": [
    { jam: "07.00", mapel: "B. Indonesia", status: "hadir" },
    { jam: "08.30", mapel: "Fisika", status: "hadir" },
  ],
  "2025-03-06": [
    { jam: "07.00", mapel: "Kimia", status: "hadir" },
    { jam: "08.30", mapel: "Matematika", status: "hadir" },
    { jam: "10.15", mapel: "Sejarah", status: "izin" },
  ],
  "2025-03-05": [
    { jam: "07.00", mapel: "B. Indonesia", status: "hadir" },
    { jam: "08.30", mapel: "Fisika", status: "hadir" },
    { jam: "10.15", mapel: "Matematika", status: "hadir" },
    { jam: "12.30", mapel: "B. Inggris", status: "hadir" },
  ],
  "2025-03-04": [
    { jam: "07.00", mapel: "Kimia", status: "hadir" },
    { jam: "08.30", mapel: "Sejarah", status: "hadir" },
    { jam: "10.15", mapel: "Matematika", status: "hadir" },
  ],
  "2025-03-03": [
    { jam: "07.00", mapel: "B. Indonesia", status: "hadir" },
    { jam: "08.30", mapel: "Fisika", status: "terlambat" },
  ],
  "2025-02-28": [
    { jam: "07.00", mapel: "Matematika", status: "hadir" },
    { jam: "08.30", mapel: "B. Indonesia", status: "hadir" },
    { jam: "10.15", mapel: "Fisika", status: "sakit" },
  ],
  "2025-02-27": [
    { jam: "07.00", mapel: "Kimia", status: "hadir" },
    { jam: "08.30", mapel: "Sejarah", status: "hadir" },
    { jam: "10.15", mapel: "Matematika", status: "alpha" },
  ],
};

const pad = (n) => String(n).padStart(2, "0");
const makeKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

const HARI_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
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

const labelFromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${HARI_ID[dow]}, ${d} ${BULAN_ID[m - 1]} ${y}`;
};

const priority = { alpha: 0, terlambat: 1, sakit: 2, izin: 3, hadir: 4 };

const dayStatus = (k) => {
  const list = records[k];
  if (!list) return null;
  return list.reduce(
    (best, r) => (priority[r.status] < priority[best] ? r.status : best),
    "hadir",
  );
};

export default function AbsensiPage() {
  const TY = 2025,
    TM = 2,
    TD = 10;
  const todayKey = makeKey(TY, TM, TD);

  const [vy, setVy] = useState(TY);
  const [vm, setVm] = useState(TM);
  const [sel, setSel] = useState(null);

  const prevMonth = () =>
    vm === 0 ? (setVy((y) => y - 1), setVm(11)) : setVm((m) => m - 1);

  const nextMonth = () =>
    vm === 11 ? (setVy((y) => y + 1), setVm(0)) : setVm((m) => m + 1);

  const firstDow = new Date(vy, vm, 1).getDay();
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();

  const allSessions = Object.values(records).flat();
  const hadirCount = allSessions.filter((r) => r.status === "hadir").length;
  const pct = Math.round((hadirCount / allSessions.length) * 100);

  const monthSessions = Array.from(
    { length: daysInMonth },
    (_, i) => records[makeKey(vy, vm, i + 1)] || [],
  ).flat();

  const monthHadir = monthSessions.filter((r) => r.status === "hadir").length;
  const monthPct = monthSessions.length
    ? Math.round((monthHadir / monthSessions.length) * 100)
    : 0;

  const selRecords = sel ? records[sel] : null;

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">
      {/* header */}

      <div>
        <h1 className="text-xl font-bold text-zinc-900">Riwayat Absensi</h1>
        <p className="text-xs text-zinc-400 mt-1">Semester Genap 2024/2025</p>
      </div>

      {/* stat cards */}

      <div className="grid grid-cols-5 gap-3">
        {[
          {
            label: "Hadir",
            val: allSessions.filter((r) => r.status === "hadir").length,
            ...statusCfg.hadir,
          },
          {
            label: "Sakit",
            val: allSessions.filter((r) => r.status === "sakit").length,
            ...statusCfg.sakit,
          },
          {
            label: "Terlambat",
            val: allSessions.filter((r) => r.status === "terlambat").length,
            ...statusCfg.terlambat,
          },
          {
            label: "Alpha",
            val: allSessions.filter((r) => r.status === "alpha").length,
            ...statusCfg.alpha,
          },
          {
            label: "Kehadiran",
            val: `${pct}%`,
            icon: CheckCircle2,
            c: pct >= 80 ? "#16A34A" : "#DC2626",
            bg: pct >= 80 ? "#DCFCE7" : "#FEE2E2",
          },
        ].map(({ label, val, icon: Icon, c, bg }) => (
          <div
            key={label}
            className="bg-white border border-zinc-200 rounded-xl p-3 flex gap-3 items-center"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: bg }}
            >
              <Icon size={15} style={{ color: c }} />
            </div>

            <div>
              <p
                className="font-bold text-lg leading-none"
                style={{ color: c }}
              >
                {val}
              </p>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* main layout */}

      <div className="grid grid-cols-[260px_1fr] gap-4">
        {/* calendar */}

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={prevMonth}
              className="border border-zinc-300 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={12} />
            </button>

            <p className="font-bold text-sm">
              {BULAN_ID[vm]} {vy}
            </p>

            <button
              onClick={nextMonth}
              className="border border-zinc-300 rounded-md w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={12} />
            </button>
          </div>

          {/* days */}

          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map((d) => (
              <p
                key={d}
                className="text-center text-[10px] text-zinc-400 font-bold"
              >
                {d}
              </p>
            ))}
          </div>

          {/* calendar cells */}

          <div className="grid grid-cols-7 gap-[2px]">
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={i} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const dk = makeKey(vy, vm, d);
              const ds = dayStatus(dk);
              const cfg = ds ? statusCfg[ds] : null;
              const isToday = dk === todayKey;
              const isSel = dk === sel;

              return (
                <button
                  key={d}
                  onClick={() => ds && setSel(isSel ? null : dk)}
                  className="aspect-square rounded-md flex flex-col items-center justify-center gap-[2px] cursor-pointer"
                  style={{
                    background: isSel
                      ? "#0EA5A0"
                      : isToday
                        ? "#E8F8F7"
                        : cfg
                          ? cfg.bg
                          : "transparent",
                    outline: isToday && !isSel ? "2px solid #0EA5A0" : "none",
                  }}
                >
                  <span
                    className="text-[11px]"
                    style={{
                      fontWeight: isToday || isSel ? 700 : 400,
                      color: isSel
                        ? "#fff"
                        : isToday
                          ? "#0EA5A0"
                          : cfg
                            ? "#18181B"
                            : "#C4C4C8",
                    }}
                  >
                    {d}
                  </span>

                  {cfg && (
                    <span
                      className="w-[4px] h-[4px] rounded-full"
                      style={{ background: isSel ? "#fff" : cfg.c }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* month summary */}

          {monthSessions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-400 flex justify-between text-xs">
              <p className="text-zinc-600">
                {monthHadir}/{monthSessions.length} sesi hadir
              </p>

              <span
                className="px-2 py-[2px] rounded-full font-bold"
                style={{
                  background: monthPct >= 80 ? "#DCFCE7" : "#FEE2E2",
                  color: monthPct >= 80 ? "#16A34A" : "#DC2626",
                }}
              >
                {monthPct}%
              </span>
            </div>
          )}

          {/* legend */}

          <div className="mt-3 pt-2 border-t border-zinc-400 flex flex-col gap-1">
            {Object.values(statusCfg).map((cfg) => (
              <div key={cfg.label} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center"
                  style={{ background: cfg.bg }}
                >
                  <cfg.icon size={9} style={{ color: cfg.c }} />
                </div>

                <span className="text-xs text-zinc-600">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* detail panel */}

        {selRecords ? (
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-400 bg-zinc-50 flex justify-between">
              <div>
                <p className="font-bold text-sm">Detail Absensi</p>

                <p className="text-xs text-zinc-400">{labelFromKey(sel)}</p>
              </div>

              <button
                onClick={() => setSel(null)}
                className="w-6 h-6 border border-zinc-300 rounded-md flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft size={12} className="rotate-180" />
              </button>
            </div>

            {selRecords.map((r, i) => {
              const cfg = statusCfg[r.status];
              const Icon = cfg.icon;

              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3 border-t border-zinc-200"
                >
                  <p className="text-xs text-zinc-400 w-10 shrink-0">{r.jam}</p>

                  <p className="flex-1 text-sm font-medium">{r.mapel}</p>

                  <span
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                    style={{ background: cfg.bg, color: cfg.c }}
                  >
                    <Icon size={10} />
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 flex flex-col items-center text-center gap-2">
            <CheckCircle2 size={24} className="text-teal-500" />

            <p className="font-semibold">Pilih Tanggal</p>

            <p className="text-sm text-zinc-400 max-w-[180px]">
              Klik tanggal pada kalender untuk melihat detail absensi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
