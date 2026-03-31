export const MAPEL_LIST = ["Matematika","Fisika","Kimia","B. Indonesia","B. Inggris","Sejarah"];
export const KELAS_LIST = ["X-A","X-B","XI-IPA","XI-IPS","XII-IPA"];

export const WARNA_MAPEL = {
  Matematika:"#0EA5A0", Fisika:"#F59E0B", Kimia:"#8B5CF6",
  "B. Indonesia":"#6366F1","B. Inggris":"#EC4899", Sejarah:"#F97316",
};

export const TIPECFG = {
  PDF:  { c:"#DC2626", bg:"#FEF2F2" },
  DOCX: { c:"#2563EB", bg:"#DBEAFE" },
  PPTX: { c:"#D97706", bg:"#FFFBEB" },
  XLSX: { c:"#16A34A", bg:"#DCFCE7" },
};

export const SISWA_LIST = [
  "Andi Wijaya","Budi Santoso","Citra Dewi","Dian Pratama","Eka Rahayu",
  "Fajar Nugraha","Gita Permata","Hendra Kusuma","Indah Lestari","Joko Santoso",
  "Kartika Sari","Luki Pratama","Maya Putri","Nanda Rizki","Ogi Firmansyah",
  "Putri Anggraini","Qori Amalia","Reza Pahlevy","Sinta Dewi","Teguh Wibowo",
  "Umi Kalsum","Vino Rizaldi","Wulan Sari","Xena Cahya","Yandi Prasetyo",
  "Zara Amelia","Aditya Nugraha","Bagas Ardianto","Cindy Aulia","Dani Setiawan",
  "Elsa Novitasari","Fandi Akbar",
];

export const TUGAS_INIT = [
  { id:1, slug:"latihan-integral-xa",      judul:"Latihan Integral",      mapel:"Matematika",   kelas:"X-A",    deadline:"2025-03-11", deskripsi:"Kerjakan soal integral hal. 45–47 buku paket. Upload jawaban dalam format PDF atau foto yang jelas.",   poin:100, dikumpulkan:24, total:32, soalFile:{name:"soal_integral.pdf",   tipe:"PDF"  } },
  { id:2, slug:"laporan-praktikum-xa",     judul:"Laporan Praktikum",     mapel:"Fisika",        kelas:"X-A",    deadline:"2025-03-14", deskripsi:"Buat laporan praktikum gelombang sesuai format yang diberikan. Sertakan data pengamatan dan analisis.",   poin:100, dikumpulkan:10, total:32, soalFile:{name:"format_laporan.docx", tipe:"DOCX" } },
  { id:3, slug:"esai-argumentatif-xb",     judul:"Esai Argumentatif",     mapel:"B. Indonesia",  kelas:"X-B",    deadline:"2025-03-17", deskripsi:"Tulis esai argumentatif minimal 500 kata tentang isu lingkungan hidup. Sertakan minimal 3 referensi.",     poin:100, dikumpulkan:30, total:30, soalFile:null },
  { id:4, slug:"reading-comprehension-xa", judul:"Reading Comprehension",  mapel:"B. Inggris",   kelas:"X-A",    deadline:"2025-03-14", deskripsi:"Kerjakan soal reading comprehension pada worksheet yang terlampir. Jawab semua pertanyaan dengan lengkap.", poin:100, dikumpulkan:32, total:32, soalFile:{name:"reading_worksheet.pdf",tipe:"PDF"  } },
  { id:5, slug:"ikatan-kimia-xipa",        judul:"Ikatan Kimia",          mapel:"Kimia",          kelas:"XI-IPA", deadline:"2025-03-20", deskripsi:"Buat rangkuman ikatan kimia lengkap dengan struktur Lewis, diagram orbital, dan contoh senyawa.",          poin:100, dikumpulkan:5,  total:28, soalFile:{name:"materi_ikatan.pptx",  tipe:"PPTX" } },
  { id:6, slug:"turunan-fungsi-xb",        judul:"Turunan Fungsi",        mapel:"Matematika",     kelas:"X-B",    deadline:"2025-03-18", deskripsi:"Kerjakan 15 soal turunan fungsi aljabar yang ada di file terlampir. Tunjukkan langkah penyelesaian.",     poin:50,  dikumpulkan:12, total:30, soalFile:{name:"soal_turunan.pdf",    tipe:"PDF"  } },
];

export const genSubmissions = (tugasId, count, total) =>
  SISWA_LIST.slice(0, total).map((nama, i) => ({
    nama,
    status: i < count ? (i % 7 === 0 ? "terlambat" : "dikumpulkan") : "belum",
    waktu:  i < count ? `${String(8 + Math.floor(i * 0.4)).padStart(2,"0")}:${String(i * 3 % 60).padStart(2,"0")}` : null,
    file:   i < count ? `${nama.split(" ")[0].toLowerCase()}_tugas.pdf` : null,
    nilai:  i < count && tugasId <= 2 ? 70 + ((i * 13 + tugasId * 7) % 30) : null,
  }));

export const fmtTgl = (s) => {
  if (!s) return "";
  const [y,m,d] = s.split("-").map(Number);
  const BLN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  return `${d} ${BLN[m-1]} ${y}`;
};

export const fmtTglShort = (s) => {
  if (!s) return "";
  const [,m,d] = s.split("-").map(Number);
  const BLN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${d} ${BLN[m-1]}`;
};

export const daysUntil = (s) => {
  if (!s) return 0;
  const [y,m,d] = s.split("-").map(Number);
  return Math.ceil((new Date(y,m-1,d) - new Date(2025,2,10)) / 86400000);
};