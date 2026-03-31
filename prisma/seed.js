const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const teacherPassword = await bcrypt.hash("teacher123", 10);

  console.log("Seeding started...");

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      password: adminPassword,
      name: "Admin MTs Jamil",
      role: "ADMIN",
    },
  });

  // 2. Create Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@test.com" },
    update: {},
    create: {
      email: "teacher@test.com",
      password: teacherPassword,
      name: "Guru Jamil",
      role: "TEACHER",
    },
  });

  console.log("Database seeded successfully!");
  console.log("Admin: admin@test.com / admin123");
  console.log("Teacher: teacher@test.com / teacher123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
