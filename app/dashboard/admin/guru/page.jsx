import prisma from "@/lib/db";
import GuruClient from "./GuruClient";

export const dynamic = "force-dynamic";

export default async function AdminGuruPage() {
  const [teachers, mapelList] = await Promise.all([
    prisma.teacher.findMany({
      include: {
        user: true,
        mataPelajaran: true,
      },
      orderBy: { user: { name: 'asc' } }
    }),
    prisma.mataPelajaran.findMany({
      orderBy: { nama: 'asc' }
    })
  ]);

  const formattedTeachers = teachers.map(t => ({
    id: t.id,
    nip: t.nip,
    nik: t.nik,
    nama: t.user.name,
    username: t.user.username,
    gender: t.gender,
    noHp: t.noHp,
    alamat: t.alamat,
    tempatLahir: t.tempatLahir,
    tanggalLahir: t.tanggalLahir,
    pendidikan: t.pendidikan,
    status: t.status,
    mapelId: t.mapelId,
    mapel: t.mataPelajaran?.nama || "Umum",
  }));

  return <GuruClient initialTeachers={formattedTeachers} mapelList={mapelList} />;
}
