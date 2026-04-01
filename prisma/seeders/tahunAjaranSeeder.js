async function seedTahunAjaran(prisma) {
  console.log("Seeding Tahun Ajaran...");

  const data = [
    { tahun: "2023/2024", semester: "Ganjil", isActive: false },
    { tahun: "2023/2024", semester: "Genap", isActive: true },
    { tahun: "2024/2025", semester: "Ganjil", isActive: false },
  ];

  for (const item of data) {
    try {
      await prisma.tahunAjaran.upsert({
        where: {
          tahun_semester: {
            tahun: item.tahun,
            semester: item.semester,
          },
        },
        update: item,
        create: item,
      });
    } catch (error) {
      console.warn(`Could not seed: ${item.tahun} ${item.semester}. Error: ${error.message}`);
    }
  }

  console.log("✅ Tahun Ajaran seeded.");
}

module.exports = { seedTahunAjaran };
