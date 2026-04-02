import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import AbsensiClient from "./AbsensiClient";

/**
 * GuruAbsensiPage (Server Component)
 * Dynamically resolves the teacher's profile and assigned classes for the attendance module.
 */
export default async function GuruAbsensiPage() {
  const session = await getSession();

  // 1. Auth Guard
  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  // 2. Resolve Teacher Profile
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.id },
    include: {
      pengampu: {
        include: {
          mapel: true,
          kelas: true
        }
      }
    }
  });

  if (!teacher) {
    redirect("/dashboard/guru");
  }

  // 3. Prepare Mapping for Client Select
  // We want to give the client a flat list of { mappingId, mapelId, mapelName, kelasId, kelasName }
  const formattedClasses = teacher.pengampu.map(p => ({
    id: p.id,
    mapelId: p.mapelId,
    mapelName: p.mapel.nama,
    kelasId: p.kelasId,
    kelasName: p.kelas.nama
  }));

  // 4. Render Client
  return (
    <AbsensiClient 
      teacherId={teacher.id} 
      assignedClasses={formattedClasses} 
    />
  );
}
