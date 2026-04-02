import { getSession } from "../../../../../lib/auth";
import prisma from "../../../../../lib/db";
import { redirect, notFound } from "next/navigation";
import { TugasService } from "../../../../../lib/services/tugas-service";
import TugasDetailClient from "./TugasDetailClient";

/**
 * TugasDetailPage (Server Component)
 * Consolidates assignment metadata, class roster, and submission history.
 */
export default async function TugasDetailPage({ params }) {
  const session = await getSession();
  const { id } = await params;

  // 1. Auth Guard
  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  try {
    // 2. Fetch Assignment Data
    const tugas = await prisma.tugas.findUnique({
      where: { id },
      include: {
        mapel: true,
        kelas: true,
        _count: {
          select: { submissions: true }
        }
      }
    });

    if (!tugas) return notFound();

    // 3. Fetch Class Roster (All students in this class)
    // We use the ID from the assignment's class record
    const students = await prisma.student.findMany({
      where: { 
        kelasId: tugas.kelasId 
      },
      include: {
        user: {
          select: { 
            name: true, 
            username: true 
          }
        }
      }
    });

    // 4. Fetch Existing Submissions
    const submissions = await TugasService.getSubmissions(id);

    // 5. Render Interaction Hub
    // Using deep clone to ensure data serialization (Dates -> Strings)
    return (
      <TugasDetailClient 
        tugas={JSON.parse(JSON.stringify(tugas))}
        students={JSON.parse(JSON.stringify(students))}
        initialSubmissions={JSON.parse(JSON.stringify(submissions))}
      />
    );
  } catch (error) {
    console.error("DEBUG [TugasDetailPage]:", error);
    return (
      <div className="p-10 text-center">
        <h1 className="text-red-500 font-bold">500 Server Error</h1>
        <p className="text-sm text-gray-500 mt-2">Gagal memuat data evaluasi. Pastikan tabel 'Student' memiliki relasi ke 'User' yang valid.</p>
        <code className="block mt-4 p-4 bg-gray-100 rounded text-left text-[10px]">
          {error.message}
        </code>
      </div>
    );
  }
}