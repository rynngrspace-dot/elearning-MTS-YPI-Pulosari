import { useState, useEffect, useMemo } from "react";
import { Download, Eye, Search, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getStudentMateriPageAction } from "@/lib/actions/siswa-actions";

/* ── Helpers ─────────────────────────────────────────────── */
const formatTgl = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const isNew = (d) => {
  const date = new Date(d);
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7; // NEW if within 7 days
};

const getMapelStyle = (mapelName) => {
  const name = mapelName.toLowerCase();
  if (name.includes("matematika") || name.includes("ipa")) return { warna: "#0EA5A0", icon: "📐" };
  if (name.includes("islam") || name.includes("agama") || name.includes("fikih") || name.includes("hadits")) return { warna: "#F59E0B", icon: "🕌" };
  if (name.includes("indonesia") || name.includes("inggris") || name.includes("arab")) return { warna: "#6366F1", icon: "📝" };
  if (name.includes("informatika") || name.includes("koding") || name.includes("ai")) return { warna: "#8B5CF6", icon: "💻" };
  if (name.includes("sejarah") || name.includes("ips") || name.includes("pancasila")) return { warna: "#F97316", icon: "🏛️" };
  return { warna: "#EC4899", icon: "📖" };
};

/* ── Component ───────────────────────────────────────────── */
export default function MateriPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchMateri = async () => {
      if (user?.kelasId) {
        const res = await getStudentMateriPageAction(user.kelasId);
        if (res.success) {
          setData(res.data);
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchMateri();
    }
  }, [user]);

  const allMapel = useMemo(() => {
    return ["Semua", ...new Set(data.map(m => m.mapel.nama))];
  }, [data]);

  const filtered = useMemo(() => {
    return data
      .filter(m => {
        const mM = filter === "Semua" || m.mapel.nama === filter;
        const mQ = m.judul.toLowerCase().includes(query.toLowerCase())
          || m.mapel.nama.toLowerCase().includes(query.toLowerCase());
        return mM && mQ;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, filter, query]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Sinkronisasi Materi...</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6 animate-[slideUp_.3s_ease]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-xl text-zinc-900 font-['Plus_Jakarta_Sans']">
            Materi Pelajaran
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {filtered.length} materi tersedia untuk kelas {user?.kelas || "Anda"}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 w-[220px]">
          <Search size={13} className="text-zinc-400" />
          <input
            type="text"
            placeholder="Cari materi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-sm text-zinc-800 w-full"
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {allMapel.map(mapel => (
          <button
            key={mapel}
            onClick={() => setFilter(mapel)}
            className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer
            ${filter === mapel
                ? "bg-teal-500 text-white border-teal-500"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"}`}
          >
            {mapel}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m, idx) => {
            const style = getMapelStyle(m.mapel.nama);
            return (
              <div
                key={m.id}
                className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5 flex flex-col gap-3 group hover:border-teal-500/30 transition-all"
                style={{
                    outline: idx === 0 && filter === "Semua" && !query
                      ? `2px solid ${style.warna}30`
                      : "none"
                  }}
              >

                {/* Top */}
                <div className="flex gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: style.warna + "18" }}
                  >
                    {style.icon}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[11px] font-semibold px-2 py-[2px] rounded-full"
                        style={{ background: style.warna + "18", color: style.warna }}
                      >
                        {m.mapel.nama}
                      </span>

                      {isNew(m.createdAt) && (
                        <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-emerald-50 text-emerald-600">
                          BARU
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-sm text-zinc-900 truncate">
                      {m.judul}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
                  {m.deskripsi || "Tidak ada deskripsi."}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-200 mt-auto">
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-zinc-600 truncate">{m.teacher?.user?.name || "Guru"}</p>
                    <p className="text-xs text-zinc-400">
                      {m.fileUrl ? m.fileUrl.split('.').pop().toUpperCase() : "DOC"} · {formatTgl(m.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <a 
                      href={m.fileUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 border border-zinc-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-50"
                    >
                      <Eye size={13} className="text-zinc-600" />
                    </a>

                    <a 
                      href={m.fileUrl || "#"} 
                      download 
                      className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center cursor-pointer hover:bg-teal-600"
                    >
                      <Download size={13} className="text-white" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen size={36} className="text-zinc-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-600">
            Materi tidak ditemukan
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Materi untuk kelas Anda belum diunggah oleh Guru
          </p>
        </div>
      )}
    </div>
  );
}
