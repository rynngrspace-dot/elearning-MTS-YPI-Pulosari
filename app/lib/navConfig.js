import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart2,
  CalendarDays,
  UserCheck,
  Megaphone,
  Users,
  Video,
  School,
  CalendarClock,
  UserRoundCheck,
  BookMarked,
} from "lucide-react";

export const navConfig = {
  siswa: [
    { icon: LayoutDashboard, label: "Beranda",  href: "/dashboard/siswa" },
    { icon: BookOpen,        label: "Materi",   href: "/dashboard/siswa/materi" },
    { icon: ClipboardList,   label: "Tugas",    href: "/dashboard/siswa/tugas" },
    { icon: BarChart2,       label: "Nilai",    href: "/dashboard/siswa/nilai" },
    { icon: CalendarDays,    label: "Jadwal",   href: "/dashboard/siswa/jadwal" },
    { icon: UserCheck,       label: "Absensi",  href: "/dashboard/siswa/absensi" },
  ],
  guru: [
    { icon: LayoutDashboard, label: "Beranda",          href: "/dashboard/guru" },
    { icon: BookMarked,      label: "Mata Pelajaran",   href: "/dashboard/guru/mapel" },
    { icon: CalendarClock,   label: "Jadwal Mengajar",  href: "/dashboard/guru/jadwal" },
    { icon: UserCheck,       label: "Presensi",         href: "/dashboard/guru/absensi" },
    { icon: BookOpen,        label: "Materi",           href: "/dashboard/guru/materi" },
    { icon: ClipboardList,   label: "Tugas",            href: "/dashboard/guru/tugas" },
    { icon: Video,           label: "Jitsi Meet",       href: "/dashboard/guru/meet" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Beranda", href: "/dashboard/admin" },
    {
      icon: Users,
      label: "Data Pengguna",
      children: [
        { label: "Kelola Siswa", href: "/dashboard/admin/siswa" },
        { label: "Kelola Guru", href: "/dashboard/admin/guru" },
      ],
    },
    { icon: School, label: "Data Kelas", href: "/dashboard/admin/kelas" },
    { icon: CalendarClock, label: "Tahun Ajaran", href: "/dashboard/admin/tahun-ajaran" },
    { icon: UserRoundCheck, label: "Data Pengampu", href: "/dashboard/admin/pengampu" },
    { icon: BookMarked, label: "Data Mapel", href: "/dashboard/admin/mapel" },
  ],
};

export const pageTitles = {
  "/dashboard":                  "Memuat...",
  "/dashboard/admin":            "Hallo Admin",
  "/dashboard/guru":             "Hallo Guru",
  "/dashboard/siswa":            "Hallo Siswa",
  // siswa
  "/dashboard/siswa/materi":     "Materi Pelajaran",
  "/dashboard/siswa/tugas":      "Tugas",
  "/dashboard/siswa/nilai":      "Rekap Nilai",
  "/dashboard/siswa/jadwal":     "Jadwal Pelajaran",
  "/dashboard/siswa/absensi":    "Riwayat Absensi",
  // guru
  "/dashboard/guru/mapel":       "Mata Pelajaran Pengampu",
  "/dashboard/guru/jadwal":      "Jadwal Mengajar",
  "/dashboard/guru/absensi":     "Presensi Siswa",
  "/dashboard/guru/tugas":       "Kelola Tugas & Latihan",
  "/dashboard/guru/nilai":       "Penilaian Siswa",
  "/dashboard/guru/materi":      "Pusat Materi Pelajaran",
  "/dashboard/guru/rekap":       "Rekapitulasi Siswa",
  "/dashboard/guru/pengumuman":  "Pusat Pengumuman",
  "/dashboard/guru/meet":        "Jitsi Video Conference",
  // admin
  "/dashboard/admin/siswa":      "Kelola Data Siswa",
  "/dashboard/admin/guru":       "Kelola Data Guru",
  "/dashboard/admin/kelas":      "Kelola Data Kelas",
  "/dashboard/admin/tahun-ajaran": "Kelola Tahun Ajaran",
  "/dashboard/admin/pengampu":   "Data Pengampu",
  "/dashboard/admin/mapel":      "Data Mata Pelajaran",
};
