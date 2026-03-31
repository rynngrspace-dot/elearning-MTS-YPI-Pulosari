import { TrendingUp, Award } from "lucide-react";

const nilaiData = [
  {
    mapel: "Matematika",
    guru: "Pak Hendra",
    warna: "#0EA5A0",
    nilai: [
      { jenis: "Ulangan Harian 1", nilai: 78, bobot: "Harian" },
      { jenis: "Ulangan Harian 2", nilai: 85, bobot: "Harian" },
      { jenis: "UTS", nilai: 82, bobot: "Tengah Semester" },
      { jenis: "Tugas 1", nilai: 90, bobot: "Tugas" },
    ],
    rata: 83.75,
  },
  {
    mapel: "B. Indonesia",
    guru: "Bu Sari",
    warna: "#6366F1",
    nilai: [
      { jenis: "Ulangan Harian 1", nilai: 88, bobot: "Harian" },
      { jenis: "UTS", nilai: 86, bobot: "Tengah Semester" },
      { jenis: "Tugas Esai", nilai: 92, bobot: "Tugas" },
    ],
    rata: 88.67,
  },
  {
    mapel: "Fisika",
    guru: "Pak Rudi",
    warna: "#F59E0B",
    nilai: [
      { jenis: "Ulangan Harian 1", nilai: 72, bobot: "Harian" },
      { jenis: "UTS", nilai: 75, bobot: "Tengah Semester" },
      { jenis: "Laporan", nilai: 88, bobot: "Tugas" },
    ],
    rata: 78.33,
  },
  {
    mapel: "B. Inggris",
    guru: "Bu Dewi",
    warna: "#EC4899",
    nilai: [
      { jenis: "Speaking Test", nilai: 90, bobot: "Praktik" },
      { jenis: "UTS", nilai: 87, bobot: "Tengah Semester" },
      { jenis: "Reading Comp.", nilai: 88, bobot: "Tugas" },
    ],
    rata: 88.33,
  },
];

function nilaiColor(n) {
  if (n >= 90) return { c: "text-green-600", bg: "bg-green-50" };
  if (n >= 80) return { c: "text-teal-600", bg: "bg-teal-50" };
  if (n >= 70) return { c: "text-yellow-600", bg: "bg-yellow-50" };
  return { c: "text-red-600", bg: "bg-red-50" };
}

function predikat(n) {
  if (n >= 90) return "A — Sangat Baik";
  if (n >= 80) return "B — Baik";
  if (n >= 70) return "C — Cukup";
  return "D — Perlu Perbaikan";
}

export default function NilaiPage() {
  const rataAll = (
    nilaiData.reduce((s, d) => s + d.rata, 0) / nilaiData.length
  ).toFixed(1);

  const rc = nilaiColor(+rataAll);

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Rekap Nilai</h2>

          <p className="text-xs text-zinc-400 mt-1">Semester Genap 2024/2025</p>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${rc.bg}`}
        >
          <Award size={18} className={rc.c} />

          <div>
            <p className={`text-xs font-semibold ${rc.c}`}>Rata-rata</p>

            <p className={`text-2xl font-extrabold leading-none ${rc.c}`}>
              {rataAll}
            </p>
          </div>
        </div>
      </div>

      {/* MAPEL CARDS */}

      <div className="flex flex-col gap-4">
        {nilaiData.map((d) => {
          const rc2 = nilaiColor(d.rata);

          return (
            <div
              key={d.mapel}
              className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm"
            >
              {/* HEADER MAPEL */}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: d.warna + "18" }}
                  >
                    <TrendingUp size={17} style={{ color: d.warna }} />
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-zinc-900">
                      {d.mapel}
                    </p>

                    <p className="text-xs text-zinc-400">{d.guru}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-2xl font-extrabold leading-none ${rc2.c}`}
                  >
                    {d.rata.toFixed(1)}
                  </p>

                  <p className={`text-xs mt-1 ${rc2.c}`}>{predikat(d.rata)}</p>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${d.rata}%`,
                    background: d.warna,
                  }}
                />
              </div>

              {/* TABLE */}

              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_140px_80px] bg-zinc-50 px-4 py-2 border-b border-zinc-200 text-xs font-semibold text-zinc-500 uppercase">
                  <p>Jenis Penilaian</p>
                  <p>Kategori</p>
                  <p className="text-right">Nilai</p>
                </div>

                {d.nilai.map((n, i) => {
                  const nc = nilaiColor(n.nilai);

                  return (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_140px_80px] px-4 py-3 items-center border-t border-zinc-100"
                    >
                      <p className="text-sm text-zinc-800">{n.jenis}</p>

                      <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 w-fit">
                        {n.bobot}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded-full w-fit justify-self-end ${nc.bg} ${nc.c}`}
                      >
                        {n.nilai}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
