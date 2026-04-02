import prisma from "../db";

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
    // Start/End of the target date
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);

    const records = await prisma.absensi.findMany({
      where: {
        kelasId,
        mapelId,
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

    return await prisma.$transaction(async (tx) => {
      // 1. Delete existing records for this specific combination of [Teacher, Mapel, Kelas, Date]
      // This is a simple 'overwrite' strategy.
      await tx.absensi.deleteMany({
        where: {
          teacherId,
          mapelId,
          kelasId,
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

    // Query dari tanggal 1 jam 00:00 s/d akhir bulan jam 23:59 (Standar UTC)
    // Karena kita simpan di jam 12:00 UTC, range ini pasti mencakup semuanya
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    return await prisma.absensi.findMany({
      where: {
        studentId,
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
  }
};
