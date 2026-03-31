const jadwal = {
  Senin: [
    {
      jam: "07.00–08.30",
      mapel: "Matematika",
      guru: "Pak Hendra",
      ruang: "Ruang.12",
      warna: "#0EA5A0",
    },
    {
      jam: "08.30–10.00",
      mapel: "B. Indonesia",
      guru: "Bu Sari",
      ruang: "Ruang.12",
      warna: "#6366F1",
    },
    {
      jam: "10.15–11.45",
      mapel: "Fisika",
      guru: "Pak Rudi",
      ruang: "Lab IPA",
      warna: "#F59E0B",
    },
    {
      jam: "12.30–14.00",
      mapel: "B. Inggris",
      guru: "Bu Dewi",
      ruang: "Ruang.12",
      warna: "#EC4899",
    },
  ],
  Selasa: [
    {
      jam: "07.00–08.30",
      mapel: "Kimia",
      guru: "Bu Rina",
      ruang: "Lab Kimia",
      warna: "#8B5CF6",
    },
    {
      jam: "08.30–10.00",
      mapel: "Sejarah",
      guru: "Pak Bima",
      ruang: "Ruang.12",
      warna: "#F97316",
    },
    {
      jam: "10.15–11.45",
      mapel: "Matematika",
      guru: "Pak Hendra",
      ruang: "Ruang.12",
      warna: "#0EA5A0",
    },
  ],
  Rabu: [
    {
      jam: "07.00–08.30",
      mapel: "B. Indonesia",
      guru: "Bu Sari",
      ruang: "Ruang.12",
      warna: "#6366F1",
    },
    {
      jam: "08.30–10.00",
      mapel: "Fisika",
      guru: "Pak Rudi",
      ruang: "Lab IPA",
      warna: "#F59E0B",
    },
    {
      jam: "10.15–11.45",
      mapel: "Penjaskes",
      guru: "Pak Yoga",
      ruang: "Lapangan",
      warna: "#16A34A",
    },
    {
      jam: "12.30–14.00",
      mapel: "B. Inggris",
      guru: "Bu Dewi",
      ruang: "Ruang.12",
      warna: "#EC4899",
    },
  ],
  Kamis: [
    {
      jam: "07.00–08.30",
      mapel: "Kimia",
      guru: "Bu Rina",
      ruang: "Lab Kimia",
      warna: "#8B5CF6",
    },
    {
      jam: "08.30–10.00",
      mapel: "Matematika",
      guru: "Pak Hendra",
      ruang: "Ruang.12",
      warna: "#0EA5A0",
    },
    {
      jam: "10.15–11.45",
      mapel: "Sejarah",
      guru: "Pak Bima",
      ruang: "Ruang.12",
      warna: "#F97316",
    },
  ],
  Jumat: [
    {
      jam: "07.00–08.30",
      mapel: "B. Indonesia",
      guru: "Bu Sari",
      ruang: "Ruang.12",
      warna: "#6366F1",
    },
    {
      jam: "08.30–10.00",
      mapel: "Fisika",
      guru: "Pak Rudi",
      ruang: "Lab IPA",
      warna: "#F59E0B",
    },
  ],
};

const HARI_INI = "Selasa";

export default function JadwalPage() {
  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Jadwal Pelajaran</h2>

        <p className="text-xs text-zinc-400 mt-1">
          Kelas X-A · Semester Genap 2024/2025
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {Object.entries(jadwal).map(([hari, pelajaran]) => {
          const isToday = hari === HARI_INI;

          return (
            <div key={hari}>
              {/* DAY HEADER */}

              <div className="flex items-center gap-3 mb-3">
                <p
                  className={`font-semibold text-sm ${
                    isToday ? "text-teal-600" : "text-zinc-600"
                  }`}
                >
                  {hari}
                </p>

                {isToday && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-teal-500 text-white rounded-full">
                    Hari Ini
                  </span>
                )}

                <div className="flex-1 h-px bg-zinc-200" />

                <p className="text-xs text-zinc-400">{pelajaran.length} sesi</p>
              </div>

              {/* CARD GRID */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pelajaran.map((p, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 shadow-sm ${
                      isToday
                        ? "bg-white border-zinc-200"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                    style={{
                      borderLeft: `4px solid ${p.warna}`,
                    }}
                  >
                    <p className="text-xs text-zinc-400 mb-1">{p.jam}</p>

                    <p className="font-semibold text-sm text-zinc-900">
                      {p.mapel}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">{p.guru}</p>

                    <div className="mt-3 pt-2 border-t border-zinc-200">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          background: p.warna + "18",
                          color: p.warna,
                        }}
                      >
                        {p.ruang}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
