import prisma from "../db";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";

/**
 * StudentBulkService - Handles high-volume student operations (Import & Shuffling)
 */
export const StudentBulkService = {
  /**
   * importFromExcel - Parses an Excel buffer and creates students in bulk
   * Expected columns: Nama, NISN, Gender (L/P)
   */
  async importFromExcel(buffer) {
    if (!buffer) throw new Error("File excel tidak ditemukan");

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (rawData.length === 0) throw new Error("Excel kosong atau tidak valid");

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    const studentPass = await bcrypt.hash("123", 10);

    for (const row of rawData) {
      try {
        const name = (row.Nama || row.name || row.NAMA)?.toString()?.trim();
        const nisn = String(row.NISN || row.nisn || row.Nisn || "").trim();
        const gender = row.Gender || row.gender || row.JK || "L";

        if (!name || name.length < 3) {
          throw new Error(`Nama lengkap "${name || ''}" minimal 3 karakter.`);
        }
        if (!nisn || nisn.length !== 10 || !/^\d+$/.test(nisn)) {
          throw new Error(`Siswa "${name}": NISN "${nisn}" tidak valid (harus tepat 10 digit angka).`);
        }

        await prisma.user.create({
          data: {
            username: nisn,
            password: studentPass,
            name: name,
            role: "STUDENT",
            studentProfile: {
              create: {
                nisn: nisn,
                gender: gender,
                status: "Aktif"
              }
            }
          }
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(error.message);
      }
    }

    return results;
  },

  /**
   * shuffleStudentsToClasses - Distributes students without classes into target classes evenly
   */
  async shuffleStudentsToClasses(targetClassIds) {
    if (!targetClassIds || targetClassIds.length === 0) {
      throw new Error("Pilih minimal satu kelas tujuan");
    }

    // 1. Get all students without a class
    const unassignedStudents = await prisma.student.findMany({
      where: { kelasId: null },
      select: { id: true }
    });

    if (unassignedStudents.length === 0) {
      throw new Error("Tidak ada siswa yang belum memiliki kelas");
    }

    // 2. Shuffle the student array (Fisher-Yates)
    const shuffled = [...unassignedStudents];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 3. Distribute evenly
    const classCount = targetClassIds.length;
    const updates = [];

    shuffled.forEach((student, index) => {
      const targetClassId = targetClassIds[index % classCount];
      updates.push(
        prisma.student.update({
          where: { id: student.id },
          data: { kelasId: targetClassId }
        })
      );
    });

    // 4. Execute in transaction
    await prisma.$transaction(updates);

    return {
      total: shuffled.length,
      perClass: Math.ceil(shuffled.length / classCount)
    };
  },

  /**
   * bulkDeleteStudents - Deletes multiple students and their associated users
   */
  async bulkDeleteStudents(studentIds) {
    if (!studentIds || studentIds.length === 0) return { count: 0 };

    return await prisma.$transaction(async (tx) => {
      // 1. Get associated user IDs to delete them (cascades to Student)
      const students = await tx.student.findMany({
        where: { id: { in: studentIds } },
        select: { userId: true }
      });

      const userIds = students.map(s => s.userId);

      // 2. Bulk delete users
      const result = await tx.user.deleteMany({
        where: { id: { in: userIds } }
      });

      return result;
    });
  }
};
