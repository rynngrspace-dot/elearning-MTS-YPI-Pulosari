import prisma from "@/lib/db";
import KelasClient from "./KelasClient";

export const dynamic = "force-dynamic";

export default async function AdminKelasPage() {
  const [kelasList, teachers] = await Promise.all([
    prisma.kelas.findMany({
      include: {
        _count: {
          select: { students: true }
        },
        waliKelas: {
          include: { user: true }
        }
      },
      orderBy: { nama: 'asc' }
    }),
    prisma.teacher.findMany({
      include: { user: true },
      orderBy: { user: { name: 'asc' } }
    })
  ]);

  return <KelasClient initialKelas={kelasList} teachers={teachers} />;
}
