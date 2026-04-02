import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import GuruJadwalClient from "./GuruJadwalClient";

/**
 * GuruJadwalPage (Server Component)
 * Dynamically fetches the weekly teaching schedule for the authenticated teacher.
 */
export default async function GuruJadwalPage() {
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

  // 3. Fetch Schedule (Pengampu)
  // We look for Pengampu records that have hari, jamMulai, and jamSelesai
  const assignedSchedules = await prisma.pengampu.findMany({
    where: { 
      teacherId: teacher.id,
      NOT: { hari: null } // Only show mapped schedules
    },
    include: {
      mapel: true,
      kelas: {
        include: {
          _count: { select: { students: true } }
        }
      }
    },
    orderBy: [
      { hari: 'asc' },
      { jamMulai: 'asc' }
    ]
  });

  // 4. Transform for Client
  const formattedSchedule = assignedSchedules.map(p => ({
    id: p.id,
    hari: p.hari,
    jamMulai: p.jamMulai || "00:00",
    jamSelesai: p.jamSelesai || "00:00",
    mapel: p.mapel.nama,
    kelas: p.kelas.nama,
    siswa: p.kelas._count.students,
  }));

  return <GuruJadwalClient initialSchedule={formattedSchedule} />;
}
