"use server";

import { AbsensiService } from "../services/absensi-service";
import prisma from "../db";

/**
 * getStudentAttendanceAction - Fetch monthly records for a student.
 */
export async function getStudentAttendanceAction(userId, month, year) {
  try {
    if (!userId) throw new Error("User ID is required");

    // 1. Cari Student ID dari User ID
    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) throw new Error("Profil siswa tidak ditemukan untuk akun ini");

    // 2. Ambil data presensi menggunakan Student ID
    const data = await AbsensiService.getStudentAttendanceByMonth(student.id, month, year);
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getStudentAttendance):", error);
    return { success: false, error: error.message || "Gagal mengambil data presensi" };
  }
}
