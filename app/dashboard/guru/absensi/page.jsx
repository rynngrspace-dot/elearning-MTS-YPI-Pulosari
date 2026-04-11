import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { TahunAjaranService } from "@/lib/services/tahun-ajaran-service";
import AbsensiClient from "./AbsensiClient";

/**
 * GuruAbsensiPage (Server Component)
 * Dynamically resolves the teacher's profile and active assigned classes for the attendance module.
 */
export default async function GuruAbsensiPage() {
  const session = await getSession();

  // 1. Auth Guard
  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  // 2. Resolve Active Year First
  const activeYear = await TahunAjaranService.getActive();
  if (!activeYear) {
     return (
       <div className="p-12 text-center bg-indigo-50 border border-indigo-200 rounded-[32px] text-indigo-700 font-bold uppercase tracking-widest text-[11px]">
         Tidak ada Tahun Ajaran yang aktif. Mohon hubungi Administrator.
       </div>
     );
  }

  // 3. Resolve Teacher Profile with FILTERED Pengampu
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.id },
    include: {
      pengampu: {
        where: { tahunAjaranId: activeYear.id }, // <--- FILTER BY ACTIVE YEAR
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

  // 4. Prepare Mapping for Client Select
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
