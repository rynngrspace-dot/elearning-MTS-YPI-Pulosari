const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Import Seeders
const { seedAdmin } = require("./seeders/adminSeeder");
const { seedTeachers } = require("./seeders/teacherSeeder");
const { seedStudents } = require("./seeders/studentSeeder");
const { seedTahunAjaran } = require("./seeders/tahunAjaranSeeder");
const { seedMapel } = require("./seeders/mapelSeeder");
const seedKelas = require("./seeders/kelasSeeder");

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.length === 0;

  console.log("🚀 Starting database seeding...");
  
  // 1. Mapel & Kelas (Foundation)
  if (runAll || args.includes("--mapel")) {
    await seedMapel(prisma);
  }

  if (runAll || args.includes("--kelas")) {
    await seedKelas(prisma);
  }

  // 2. Tahun Ajaran (Foundation)
  if (runAll || args.includes("--tahun-ajaran")) {
    await seedTahunAjaran(prisma);
  }

  // 3. Admin
  if (runAll || args.includes("--admin")) {
    await seedAdmin(prisma);
  }
  
  // 4. Guru (Depends on Mapel & Kelas & TahunAjaran for Pengampu)
  if (runAll || args.includes("--guru")) {
    await seedTeachers(prisma);
  }

  // 5. Siswa (Depends on Kelas)
  if (runAll || args.includes("--siswa")) {
    await seedStudents(prisma);
  }

  console.log("✨ Database seeding process finished!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
