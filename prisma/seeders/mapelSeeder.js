async function seedMapel(prisma) {
  console.log("Starting Resilient Subject Update...");

  const mapels = [
    // Umum
    { nama: "Pendidikan Pancasila", kode: "PP", kategori: "umum" },
    { nama: "Bahasa Indonesia", kode: "BINDO", kategori: "umum" },
    { nama: "Matematika", kode: "MTK", kategori: "umum" },
    { nama: "IPA", kode: "IPA", kategori: "umum" },
    { nama: "IPS", kode: "IPS", kategori: "umum" },
    { nama: "Bahasa Inggris", kode: "BING", kategori: "umum" },
    { nama: "PJOK", kode: "PJOK", kategori: "umum" },
    { nama: "Informatika", kode: "INFO", kategori: "umum" },
    { nama: "Seni Budaya dan Prakarya", kode: "SBDP", kategori: "umum" },
    { nama: "Muatan Lokal", kode: "MULOK", kategori: "umum" },

    // Agama
    { nama: "Al-Qur’an Hadits", kode: "QH", kategori: "agama" },
    { nama: "Akidah Akhlak", kode: "AA", kategori: "agama" },
    { nama: "Fikih", kode: "FIKIH", kategori: "agama" },
    { nama: "Sejarah Kebudayaan Islam", kode: "SKI", kategori: "agama" },
    { nama: "Bahasa Arab", kode: "BARAB", kategori: "agama" },

    // Kejuruan -> moved to umum
    { nama: "Koding dan Kecerdasan Artifisial", kode: "AI-KODE", kategori: "umum" },
  ];

  for (const item of mapels) {
    try {
      // Find existing by Name OR Code
      const existing = await prisma.mataPelajaran.findFirst({
        where: {
          OR: [
            { nama: item.nama },
            { kode: item.kode }
          ]
        }
      });

      if (existing) {
        // Update existing to prevent unique constraint failures and preserve IDs
        await prisma.mataPelajaran.update({
          where: { id: existing.id },
          data: {
            nama: item.nama,
            kode: item.kode,
            kategori: item.kategori
          }
        });
        console.log(`- Updated: ${item.nama}`);
      } else {
        // Create new
        await prisma.mataPelajaran.create({
          data: item
        });
        console.log(`- Created: ${item.nama}`);
      }
    } catch (error) {
      console.error(`- Failed to process ${item.nama}:`, error.message);
    }
  }

  console.log("✅ Subject categories successfully updated.");
}

module.exports = { seedMapel };
