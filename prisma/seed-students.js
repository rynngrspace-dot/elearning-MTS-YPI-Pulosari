const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding 10 mock students (unassigned)...');

  const names = [
    'Rizky Pratama', 'Siti Aminah', 'Budi Santoso', 'Dewi Lestari', 
    'Fajar Ramadhan', 'Gita Permata', 'Hendra Kusuma', 'Indah Cahyani',
    'Joko Widodo', 'Kartika Putri'
  ];

  const hashedPassword = await bcrypt.hash('123', 10);

  for (let i = 0; i < names.length; i++) {
    const nisn = `001234560${i}`;
    try {
      await prisma.user.create({
        data: {
          username: nisn,
          password: hashedPassword,
          name: names[i],
          role: 'STUDENT',
          studentProfile: {
            create: {
              nisn: nisn,
              nis: `2024${i.toString().padStart(3, '0')}`,
              status: 'Aktif',
              tahunMasuk: '2024',
              gender: i % 2 === 0 ? 'L' : 'P'
            }
          }
        }
      });
      console.log(`✅ Created student: ${names[i]}`);
    } catch (e) {
      console.log(`❌ Skipped ${names[i]} (likely already exists)`);
    }
  }

  console.log('✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
