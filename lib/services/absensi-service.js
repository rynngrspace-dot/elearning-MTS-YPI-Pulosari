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
    
    // Convert date string/object to Date at start of day
    const submissionDate = new Date(date);
    submissionDate.setHours(0,0,0,0);

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
  }
};
