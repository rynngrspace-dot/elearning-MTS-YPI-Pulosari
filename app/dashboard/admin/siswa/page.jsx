import prisma from "@/lib/db";
import SiswaClient from "./SiswaClient";

export const dynamic = "force-dynamic";

export default async function AdminSiswaPage() {
  const [students, kelasList] = await Promise.all([
    prisma.student.findMany({
      include: {
        user: true,
        kelas: true,
      },
      orderBy: {
        user: { name: 'asc' }
      }
    }),
    prisma.kelas.findMany({
      orderBy: { nama: 'asc' }
    })
  ]);

  // Format data for client
  const formattedStudents = students.map(s => ({
    id: s.id,
    nisn: s.nisn,
    nis: s.nis,
    nik: s.nik,
    nama: s.user.name,
    username: s.user.username,
    kelas: s.kelas?.nama || "Tanpa Kelas",
    kelasId: s.kelasId,
    gender: s.gender,
    status: s.status,
    tempatLahir: s.tempatLahir,
    tanggalLahir: s.tanggalLahir,
    alamat: s.alamat,
    asalSD: s.asalSD,
    namaAyah: s.namaAyah,
    namaIbu: s.namaIbu,
    noHpOrangTua: s.noHpOrangTua,
    tahunMasuk: s.tahunMasuk,
  }));

  return <SiswaClient initialStudents={formattedStudents} kelasList={kelasList} />;
}
