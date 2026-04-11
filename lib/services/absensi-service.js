import prisma from "../db";
import { TahunAjaranService } from "./tahun-ajaran-service";

/**
 * AbsensiService - Domain logic for recording and retrieving student attendance.
 */
export const AbsensiService = {
  /**
   * getStudentsByClass - Fetches all students in a specific class for attendance.
   * @param {string} kelasId - Internal ID of the Classe.
   */
  async getStudentsByClass(kelasId) {
    if (!kelasId) throw new Error("ID Kelas diperlukan");

    return await prisma.student.findMany({
      where: { 
        kelasId,
        status: "Aktif"
       },
      include: { user: true },
      orderBy: { user: { name: 'asc' } }
    });
  },

  /**
   * getExistingRecords - Retrieves attendance records for a class on a specific date.
   * @param {string} kelasId - Class ID.
   * @param {Date} date - Specific date.
   */
  async getExistingRecords(kelasId, mapelId, date) {
    // Normalize target date to UTC Noon range for robust matching
    // We want to capture anything in the SAME UTC day as the input
    const d = new Date(date);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const day = d.getUTCDate();

    const start = new Date(Date.UTC(y, m, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, day, 23, 59, 59, 999));

    const activeYear = await TahunAjaranService.getActive();
    if (!activeYear) return {};

    const records = await prisma.absensi.findMany({
      where: {
        kelasId,
        mapelId,
        tahunAjaranId: activeYear.id,
        tanggal: {
          gte: start,
          lte: end
        }
      },
      select: {
        studentId: true,
        status: true,
        keterangan: true
      }
    });

    // Map into a status draft object: { studentId: status }
    return Object.fromEntries(records.map(r => [r.studentId, r.status]));
  },

  /**
   * saveAttendance - Upserts attendance records for multiple students.
   * @param {Object} data - Contains teacherId, mapelId, kelasId, date, and statuses.
   */
  async saveAttendance(data) {
    const { teacherId, mapelId, kelasId, date, statuses } = data;
    
    // FORCE UTC NOON: Gunakan jam 12 siang UTC agar tanggal terkunci & tidak bergeser walau ada shift 7 jam
    const [y, m, d] = date.split('-').map(Number);
    const submissionDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    const activeYear = await TahunAjaranService.getActive();
    if (!activeYear) throw new Error("Tidak ada Tahun Ajaran aktif.");

    return await prisma.$transaction(async (tx) => {
      // 1. Delete existing records for this specific combination of [Teacher, Mapel, Kelas, Date, Year]
      await tx.absensi.deleteMany({
        where: {
          teacherId,
          mapelId,
          kelasId,
          tahunAjaranId: activeYear.id,
          tanggal: {
            gte: submissionDate,
            lte: new Date(new Date(submissionDate).setHours(23,59,59,999))
          }
        }
      });

      // 2. Create new records for all students
      const createBatch = Object.entries(statuses).map(([studentId, status]) => ({
        studentId,
        status, // "Hadir", "Izin", "Sakit", "Alpha"
        kelasId,
        mapelId,
        teacherId,
        tahunAjaranId: activeYear.id,
        tanggal: submissionDate
      }));

      return await tx.absensi.createMany({
        data: createBatch
      });
    });
  },

  /**
   * getStudentAttendanceByMonth - Fetches all records for a student in a specific month.
   */
  async getStudentAttendanceByMonth(studentId, month, year) {
    if (!studentId) throw new Error("Student ID is required");

    const activeYear = await TahunAjaranService.getActive();
    if (!activeYear) return [];

    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    return await prisma.absensi.findMany({
      where: {
        studentId,
        tahunAjaranId: activeYear.id,
        tanggal: {
          gte: start,
          lte: end
        }
      },
      include: {
        mapel: true
      },
      orderBy: { tanggal: 'asc' }
    });
  },

  /**
   * getStudentSummary - Calculates attendance summary for a specific student.
   */
  async getStudentSummary(studentId) {
    if (!studentId) throw new Error("Student ID is required");

    const activeYear = await TahunAjaranService.getActive();
    if (!activeYear) return { hadir: 0, izin: 0, sakit: 0, alpha: 0, percentage: 0 };

    const records = await prisma.absensi.findMany({
      where: { 
        studentId,
        tahunAjaranId: activeYear.id
      }
    });

    const total = records.length;
    if (total === 0) return { hadir: 0, izin: 0, sakit: 0, alpha: 0, percentage: 0 };

    const counts = records.reduce((acc, curr) => {
      const status = curr.status.toLowerCase();
      if (acc[status] !== undefined) acc[status]++;
      return acc;
    }, { hadir: 0, izin: 0, sakit: 0, alpha: 0 });

    const percentage = Math.round((counts.hadir / total) * 100);

    return {
      ...counts,
      total,
      percentage
    };
  }
};
