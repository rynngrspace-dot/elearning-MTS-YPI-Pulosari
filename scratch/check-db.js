const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const mapels = await prisma.mataPelajaran.findMany();
    console.log("=== Mata Pelajaran ===");
    console.log(mapels.map(m => ({ id: m.id, nama: m.nama })));

    const pengampus = await prisma.pengampu.findMany({
      include: {
        mapel: true,
        kelas: true
      }
    });
    console.log("\n=== Daftar Pengampu ===");
    console.log(pengampus.map(p => ({ 
      id: p.id, 
      kelas: p.kelas.nama, 
      mapel: p.mapel.nama 
    })));

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
