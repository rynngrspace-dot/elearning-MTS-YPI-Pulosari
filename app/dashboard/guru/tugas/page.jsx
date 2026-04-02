import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { TugasService } from "@/lib/services/tugas-service";
import GuruTugasClient from "./GuruTugasClient";

/**
 * GuruTugasPage (Server Component)
 * Dynamically resolves the teacher's profile, alocations, and existing tasks.
 */
export default async function GuruTugasPage(props) {
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
  const formattedClasses = teacher.pengampu.map(p => ({
    id: p.id,
    mapelId: p.mapelId,
    mapelName: p.mapel.nama,
    kelasId: p.kelasId,
    kelasName: p.kelas.nama
  }));

  // 4. Fetch Initial Assignments
  const initialTugas = await TugasService.getTugas(teacher.id);

  // 5. Render Responsive Client
  return (
    <GuruTugasClient 
      teacherId={teacher.id} 
      assignedClasses={formattedClasses}
      initialTugas={JSON.parse(JSON.stringify(initialTugas))}
    />
  );
}