"use server";

import { SiswaService } from "../services/siswa-service";
import { TugasService } from "../services/tugas-service";
import { MateriService } from "../services/materi-service";
import { AbsensiService } from "../services/absensi-service";
import { PengampuService } from "../services/pengampu-service";
import { TahunAjaranService } from "../services/tahun-ajaran-service";
import { StudentBulkService } from "../services/student-bulk-service";
import { revalidatePath } from "next/cache";

/**
 * createSiswaAction - Server Action to handle new student registration.
 */
export async function createSiswaAction(data) {
  try {
    const result = await SiswaService.create(data);
    revalidatePath("/dashboard/admin/siswa");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createSiswa):", error);
    return { success: false, error: error.message || "Gagal menambahkan siswa" };
  }
}

/**
 * updateSiswaAction - Server Action to update student profile.
 */
export async function updateSiswaAction(id, data) {
  try {
    const result = await SiswaService.update(id, data);
    revalidatePath("/dashboard/admin/siswa");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (updateSiswa):", error);
    return { success: false, error: error.message || "Gagal memperbarui siswa" };
  }
}

/**
 * deleteSiswaAction - Server Action to delete student.
 */
export async function deleteSiswaAction(id) {
  try {
    await SiswaService.delete(id);
    revalidatePath("/dashboard/admin/siswa");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deleteSiswa):", error);
    return { success: false, error: error.message || "Gagal menghapus siswa" };
  }
}
/**
 * assignToKelasAction - Action to enroll student.
 */
export async function assignToKelasAction(studentId, kelasId) {
  try {
    await SiswaService.assignToKelas(studentId, kelasId);
    revalidatePath(`/dashboard/admin/kelas/${kelasId}`);
    return { success: true };
  } catch (error) {
    console.error("Action Error (assignToKelas):", error);
    return { success: false, error: error.message };
  }
}

/**
 * unassignFromKelasAction - Action to remove student from class.
 */
export async function unassignFromKelasAction(studentId, kelasId) {
  try {
    await SiswaService.assignToKelas(studentId, null);
    revalidatePath(`/dashboard/admin/kelas/${kelasId}`);
    return { success: true };
  } catch (error) {
    console.error("Action Error (unassignFromKelas):", error);
    return { success: false, error: error.message };
  }
}
/**
 * bulkAssignToKelasAction - Action to enroll multiple students.
 */
export async function bulkAssignToKelasAction(studentIds, kelasId) {
  try {
    await SiswaService.bulkAssignToKelas(studentIds, kelasId);
    revalidatePath(`/dashboard/admin/kelas/${kelasId}`);
    return { success: true };
  } catch (error) {
    console.error("Action Error (bulkAssignToKelas):", error);
    return { success: false, error: error.message };
  }
}

/**
 * getStudentDashboardDataAction - Fetches aggregated data for student home page.
 */
export async function getStudentDashboardDataAction(studentId, kelasId) {
  try {
    if (!kelasId || !studentId) throw new Error("Student profile data is required");

    // Parallel fetch for speed
    const [schedules, tugas, materi, absensiSummary, activeYear] = await Promise.all([
      PengampuService.getByKelasId(kelasId),
      TugasService.getTugasForStudent(kelasId, studentId),
      MateriService.getByKelasId(kelasId, 3),
      AbsensiService.getStudentSummary(studentId),
      TahunAjaranService.getActive()
    ]);

    return { 
      success: true, 
      data: {
        schedules,
        tugas,
        materi,
        absensiSummary,
        activeYear
      } 
    };
  } catch (error) {
    console.error("Action Error (getStudentDashboardData):", error);
    return { success: false, error: error.message || "Gagal mengambil data dashboard" };
  }
}

/**
 * getStudentMateriPageAction - Action for the dedicated Materi page.
 */
export async function getStudentMateriPageAction(kelasId) {
  try {
    if (!kelasId) throw new Error("Kelas ID is required");
    const data = await MateriService.getByKelasId(kelasId, 50); // Fetch more for the full page
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getStudentMateriPage):", error);
    return { success: false, error: error.message || "Gagal mengambil data materi" };
  }
}

/**
 * getStudentTugasPageAction - Action for the dedicated Tugas page with submission info.
 */
export async function getStudentTugasPageAction(studentId, kelasId) {
  try {
    if (!studentId || !kelasId) throw new Error("Student and Class ID are required");
    const data = await TugasService.getTugasForStudent(kelasId, studentId);
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getStudentTugasPage):", error);
    return { success: false, error: error.message || "Gagal mengambil data tugas" };
  }
}

/**
 * submitTugasAction - Action to handle student assignment submission.
 */
export async function submitTugasAction(data) {
  try {
    const result = await TugasService.submitTugas(data);
    // You'd typically revalidate the specific task page or dashboard
    revalidatePath("/dashboard/siswa/tugas");
    revalidatePath("/dashboard/siswa");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (submitTugas):", error);
    return { success: false, error: error.message || "Gagal mengumpulkan tugas" };
  }
}

/**
 * importStudentsFromExcelAction - Handles Excel file upload and bulk student creation.
 * @param {FormData} formData - Contains the 'file' field
 */
export async function importStudentsFromExcelAction(formData) {
  try {
    const file = formData.get("file");
    if (!file) throw new Error("File tidak ditemukan");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await StudentBulkService.importFromExcel(buffer);
    
    revalidatePath("/dashboard/admin/siswa");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (importStudentsFromExcel):", error);
    return { success: false, error: error.message || "Gagal mengimpor data siswa" };
  }
}

/**
 * shuffleStudentsAction - Automatically distributes students without classes.
 * @param {string[]} targetClassIds - List of Kelas IDs
 */
export async function shuffleStudentsAction(targetClassIds) {
  try {
    const result = await StudentBulkService.shuffleStudentsToClasses(targetClassIds);
    
    revalidatePath("/dashboard/admin/kelas");
    revalidatePath("/dashboard/admin/siswa");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (shuffleStudents):", error);
    return { success: false, error: error.message || "Gagal mengacak kelas siswa" };
  }
}

/**
 * bulkDeleteSiswaAction - Action to remove multiple students at once.
 * @param {string[]} ids - Array of Student IDs
 */
export async function bulkDeleteSiswaAction(ids) {
  try {
    const result = await StudentBulkService.bulkDeleteStudents(ids);
    revalidatePath("/dashboard/admin/siswa");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (bulkDeleteSiswa):", error);
    return { success: false, error: error.message || "Gagal menghapus data massal" };
  }
}
