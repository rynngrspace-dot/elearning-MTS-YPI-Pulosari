import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { MateriService } from "@/lib/services/materi-service";
import GuruMateriClient from "./GuruMateriClient";

/**
 * GuruMateriPage (Server Component)
 * Dynamically resolves the teacher's profile, alocations, and existing materials.
 */
export default async function GuruMateriPage(props) {
  // Use await for searchParams according to Next.js 15+ patterns if applicable, 
  // or handle as regular props if 14. 
  // For this project context we'll handle safely.
  const searchParams = await props.searchParams;
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

  // 4. Fetch Initial Materials
  const initialMaterials = await MateriService.getMateri(teacher.id, {
    mapelId: searchParams.mapelId,
    kelasId: searchParams.kelasId
  });

  // 5. Render Client
  return (
    <GuruMateriClient 
      teacherId={teacher.id} 
      assignedClasses={formattedClasses}
      initialMaterials={JSON.parse(JSON.stringify(initialMaterials))}
    />
  );
}