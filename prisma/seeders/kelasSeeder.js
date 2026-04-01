const classes = [
  { nama: 'X RPL 1', tingkat: 'X' },
  { nama: 'X RPL 2', tingkat: 'X' },
  { nama: 'X TKJ 1', tingkat: 'X' },
  { nama: 'XI RPL 1', tingkat: 'XI' },
  { nama: 'XI TKJ 1', tingkat: 'XI' },
  { nama: 'XII RPL 1', tingkat: 'XII' },
];

async function seedKelas(prisma) {
  console.log('Seeding Kelas...');
  for (const k of classes) {
    await prisma.kelas.upsert({
      where: { nama: k.nama },
      update: {},
      create: k,
    });
  }
  console.log('✅ Kelas seeded.');
}

module.exports = seedKelas;
