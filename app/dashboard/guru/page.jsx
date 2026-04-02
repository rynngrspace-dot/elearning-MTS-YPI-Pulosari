import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { TeacherDashboardService } from "@/lib/services/teacher-dashboard-service";
import GuruDashboardClient from "./GuruDashboardClient";

/**
 * GuruPage (Server Component)
 * Fetches dynamic data for the authenticated teacher and renders the high-performance client UI.
 */
export default async function GuruPage() {
  const session = await getSession();

  // 1. Auth Guard
  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  // 2. Resolve Teacher Profile
  // We need to find the Teacher ID linked to this User ID
  const teacherProfile = await prisma.teacher.findUnique({
    where: { userId: session.id },
    select: { id: true }
  });

  if (!teacherProfile) {
    // This case happens if a user has the TEACHER role but no Teacher profile record
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-black text-ink uppercase mb-2">Profil Tidak Ditemukan</h2>
        <p className="text-ink-3 max-w-md">Akun Anda belum memiliki profil Guru yang lengkap. Silakan hubungi Administrator sistem.</p>
      </div>
    );
  }

  // 3. Fetch Aggregate Dashboard Data
  let dashboardData;
  try {
    dashboardData = await TeacherDashboardService.getDashboardData(teacherProfile.id);
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-black text-ink uppercase mb-2">Gagal Memuat Data</h2>
        <p className="text-ink-3 max-w-md">{error.message || "Terjadi kesalahan internal saat mengambil data dashboard."}</p>
      </div>
    );
  }

  // 4. Render Client UI
  return <GuruDashboardClient data={dashboardData} />;
}