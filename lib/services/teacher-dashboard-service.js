import prisma from "../db";

/**
 * TeacherDashboardService - Business logic for aggregating teacher-specific dashboard metrics.
 */
export const TeacherDashboardService = {
  /**
   * getDashboardData - Fetches a comprehensive set of real-time metrics for a specific teacher.
   * @param {string} teacherId - The internal ID of the Teacher record.
   */
  async getDashboardData(teacherId) {
    if (!teacherId) throw new Error("ID Guru diperlukan");

    // 5. Active Academic Year
    const activeTA = await prisma.tahunAjaran.findFirst({
      where: { isActive: true }
    });

    const [teacher, classes, recentTugas, recentAbsensi] = await Promise.all([
      // 1. Teacher Basic Info
      prisma.teacher.findUnique({
        where: { id: teacherId },
        include: { user: true, mataPelajaran: true }
      }),

      // 2. Classes Taught (through Pengampu) - Already naturally filtered if Pengampu has year
      prisma.pengampu.findMany({
        where: { 
          teacherId,
          tahunAjaranId: activeTA?.id || 'none'
        },
        include: {
          kelas: {
            include: {
              _count: { select: { students: true } }
            }
          },
          mapel: true
        }
      }),

      // 3. Recent Tasks Created - Filtered by Active Year
      prisma.tugas.findMany({
        where: { 
          teacherId,
          tahunAjaranId: activeTA?.id || 'none'
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          kelas: true,
          _count: { select: { submissions: true } }
        }
      }),

      // 4. Recent Attendance Records - Filtered by Active Year
      prisma.absensi.findMany({
        where: { 
          teacherId,
          tahunAjaranId: activeTA?.id || 'none',
          tanggal: {
            gte: new Date(new Date().setHours(0,0,0,0)), // Today
          }
        },
        include: { student: { include: { user: true } } },
        take: 10,
        orderBy: { createdAt: 'desc' }
      }),
    ]);

    if (!teacher) throw new Error("Profil guru tidak ditemukan");

    // Process unique students count
    const uniqueClassIds = [...new Set(classes.map(c => c.kelasId))];
    const totalStudentsInClasses = await prisma.student.count({
      where: { kelasId: { in: uniqueClassIds } }
    });

    const activeMateriCount = await prisma.materi.count({
      where: { 
        teacherId,
        tahunAjaranId: activeTA?.id || 'none'
      }
    });

    return {
      teacher: {
        name: teacher.user.name,
        nip: teacher.nip || "N/A",
        subject: teacher.mataPelajaran?.nama || "Umum"
      },
      stats: {
        totalStudents: totalStudentsInClasses,
        activeTasks: recentTugas.length,
        attendanceToday: recentAbsensi.length,
        totalMaterials: activeMateriCount
      },
      tugas: recentTugas.map(t => ({
        id: t.id,
        judul: t.judul,
        kelas: t.kelas.nama,
        deadline: t.dueDate ? t.dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : "No Limit",
        dikumpulkan: t._count.submissions,
        total: t.kelas._count?.students || 0, // Fallback if count missing
        urgent: t.dueDate && (new Date(t.dueDate) - new Date() < 86400000) // Less than 24h
      })),
      absensi: recentAbsensi.map(a => ({
        nama: a.student.user.name,
        status: a.status.toLowerCase()
      })),
      academic: activeTA ? {
        tahun: activeTA.tahun,
        semester: activeTA.semester
      } : null
    };
  }
};
