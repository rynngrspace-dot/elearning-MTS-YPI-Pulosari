import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import GuruMapelClient from "./GuruMapelClient";

/**
 * GuruMapelPage (Server Component)
 * Dynamically fetches assigned subjects and classes for the authenticated teacher.
 */
export default async function GuruMapelPage() {
  const session = await getSession();

  // 1. Auth Guard
  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  // 2. Resolve Teacher Profile
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.id },
    select: { id: true }
  });

  if (!teacher) {
    redirect("/dashboard/guru");
  }

  // 3. Fetch Assigned Subjects (Pengampu)
  const assignedSubjects = await prisma.pengampu.findMany({
    where: { teacherId: teacher.id },
    include: {
      mapel: true,
      kelas: {
        include: {
          _count: { select: { students: true } }
        }
      }
    },
    orderBy: {
      mapel: { nama: 'asc' }
    }
  });

  // 4. Transform for Client
  const formattedMapel = assignedSubjects.map(p => ({
    id: p.id,
    mapelId: p.mapelId,
    kelasId: p.kelasId,
    nama: p.mapel.nama,
    kelas: p.kelas.nama,
    siswa: p.kelas._count.students,
    hari: "Senin", // Logic for schedule day can be added later if needed
    jam: null
  }));

  return <GuruMapelClient initialMapel={formattedMapel} />;
}
