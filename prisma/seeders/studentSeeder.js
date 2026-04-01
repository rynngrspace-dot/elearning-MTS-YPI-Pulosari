const bcrypt = require("bcryptjs");

async function seedStudents(prisma) {
  console.log("Seeding Students...");
  // Get a class ID
  const classX = await prisma.kelas.findUnique({ where: { nama: "X RPL 1" } });

  const students = [
    {
      username: "1234567890",
      nisn: "1234567890",
      name: "Siswa Jamil",
      kelasId: classX?.id
    },
    {
      username: "1234567891",
      nisn: "1234567891",
      name: "Andi Wijaya",
      kelasId: classX?.id
    }
  ];

  for (const s of students) {
    const hashedPassword = await bcrypt.hash("123", 10);
    await prisma.user.upsert({
      where: { username: s.username },
      update: {},
      create: {
        username: s.username,
        password: hashedPassword,
        name: s.name,
        role: "STUDENT",
        studentProfile: {
          create: {
            nisn: s.nisn,
            kelasId: s.kelasId
          }
        }
      }
    });
  }

  console.log("✅ Students seeded.");
}

module.exports = { seedStudents };
