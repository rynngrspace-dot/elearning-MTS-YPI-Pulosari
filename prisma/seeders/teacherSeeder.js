const bcrypt = require("bcryptjs");

async function seedTeachers(prisma) {
  console.log("Seeding Teachers...");
  const hashedPassword = await bcrypt.hash("123", 10);

  // Fetch dependencies
  const mapelSiskomdig = await prisma.mataPelajaran.findUnique({ where: { kode: "AI-KODE" } });
  const mapelMTK = await prisma.mataPelajaran.findUnique({ where: { kode: "MTK" } });
  const classX = await prisma.kelas.findUnique({ where: { nama: "X RPL 1" } });
  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { isActive: true } });

  const teachers = [
    {
      username: "guru@tes.com",
      name: "Drs. Jamil Guru",
      nip: "197001012000031001",
      mapelId: mapelSiskomdig?.id,
      isWaliKelas: true
    },
    {
      username: "hendra@sekolah.id",
      name: "Hendra Wijaya, S.Pd",
      nip: "198505122010011002",
      mapelId: mapelMTK?.id,
      isWaliKelas: false
    }
  ];

  for (const t of teachers) {
    const hashedPassword = await bcrypt.hash("123", 10);
    const user = await prisma.user.upsert({
      where: { username: t.username },
      update: {
        name: t.name,
        teacherProfile: {
          update: {
            mapelId: t.mapelId
          }
        }
      },
      create: {
        username: t.username,
        password: hashedPassword,
        name: t.name,
        role: "TEACHER",
        teacherProfile: {
          create: {
            nip: t.nip,
            mapelId: t.mapelId,
          }
        }
      },
      include: { teacherProfile: true }
    });

    // If teacher is Wali Kelas
    if (t.isWaliKelas && classX && user.teacherProfile) {
      await prisma.kelas.update({
        where: { id: classX.id },
        data: { waliKelasId: user.teacherProfile.id }
      });
    }

    // Create a Pengampu record for the primary subject/class
    if (user.teacherProfile && t.mapelId && classX && tahunAjaran) {
      await prisma.pengampu.upsert({
        where: {
          teacherId_mapelId_kelasId_tahunAjaranId: {
            teacherId: user.teacherProfile.id,
            mapelId: t.mapelId,
            kelasId: classX.id,
            tahunAjaranId: tahunAjaran.id
          }
        },
        update: {},
        create: {
          teacherId: user.teacherProfile.id,
          mapelId: t.mapelId,
          kelasId: classX.id,
          tahunAjaranId: tahunAjaran.id
        }
      });
    }
  }

  console.log("✅ Teachers seeded.");
}

module.exports = { seedTeachers };
