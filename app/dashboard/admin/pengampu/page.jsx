import prisma from "@/lib/db";
import PengampuClient from "./PengampuClient";

export const dynamic = "force-dynamic";

export default async function AdminPengampuPage() {
  const [
    pengampu,
    teachers,
    mapels,
    kelas,
    academics
  ] = await Promise.all([
    prisma.pengampu.findMany({
      include: {
        teacher: { include: { user: true } },
        mapel: true,
        kelas: true,
        tahunAjaran: true,
      },
      orderBy: [
        { tahunAjaran: { tahun: 'desc' } },
        { kelas: { nama: 'asc' } }
      ]
    }),
    prisma.teacher.findMany({
      include: { user: true },
      orderBy: { user: { name: 'asc' } }
    }),
    prisma.mataPelajaran.findMany({
      orderBy: { nama: 'asc' }
    }),
    prisma.kelas.findMany({
      orderBy: { nama: 'asc' }
    }),
    prisma.tahunAjaran.findMany({
      orderBy: { tahun: 'desc' }
    })
  ]);

  return (
    <PengampuClient 
      initialData={pengampu}
      teachers={teachers}
      mapels={mapels}
      kelas={kelas}
      academics={academics}
    />
  );
}
