const bcrypt = require("bcryptjs");

async function seedAdmin(prisma) {
  console.log("Seeding Admin...");
  const hashedPassword = await bcrypt.hash("123", 10);

  const adminData = {
    username: "admin@tes.com",
    name: "Admin E-Learning",
    role: "ADMIN",
    password: hashedPassword,
  };

  await prisma.user.upsert({
    where: { username: adminData.username },
    update: adminData,
    create: adminData,
  });

  console.log("✅ Admin seeded.");
}

module.exports = { seedAdmin };
