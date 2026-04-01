async function seedMapel(prisma) {
  console.log("Seeding Mata Pelajaran...");

  const mapels = [
    { nama: "Pendidikan Agama dan Budi Pekerti", kode: "PAIBP", kelompok: "Kelompok A (Umum)" },
    { nama: "Pendidikan Pancasila dan Kewarganegaraan", kode: "PPKN", kelompok: "Kelompok A (Umum)" },
    { nama: "Bahasa Indonesia", kode: "BINDO", kelompok: "Kelompok A (Umum)" },
    { nama: "Matematika", kode: "MTK-1", kelompok: "Kelompok A (Umum)" },
    { nama: "Sejarah Indonesia", kode: "SEJIND", kelompok: "Kelompok A (Umum)" },
    { nama: "Bahasa Inggris", kode: "BING", kelompok: "Kelompok A (Umum)" },
    { nama: "Seni Budaya", kode: "SENBUD", kelompok: "Kelompok B (Umum)" },
    { nama: "Pendidikan Jasmani, Olahraga & Kesehatan", kode: "PJOK", kelompok: "Kelompok B (Umum)" },
    { nama: "Simulasi dan Komunikasi Digital", kode: "SISKOMDIG", kelompok: "Kelompok C (Kejuruan)" },
  ];

  for (const item of mapels) {
    await prisma.mataPelajaran.upsert({
      where: { nama: item.nama },
      update: item,
      create: item,
    });
  }

  console.log("✅ Mata Pelajaran seeded.");
}

module.exports = { seedMapel };
