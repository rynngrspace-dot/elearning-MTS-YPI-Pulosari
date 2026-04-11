"use server";

import { PengampuService } from "../services/pengampu-service";
import { SiswaService } from "../services/siswa-service";
import { revalidatePath } from "next/cache";

/**
 * createPengampuAction - Server Action to create a new teacher assignment.
 */
export async function createPengampuAction(data) {
  try {
    const result = await PengampuService.create(data);
    revalidatePath("/dashboard/admin/pengampu");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createPengampu):", error);
    return { success: false, error: error.message || "Gagal membuat penugasan" };
  }
}

/**
 * updatePengampuAction - Server Action to update teacher assignment.
 */
export async function updatePengampuAction(id, data) {
  try {
    const result = await PengampuService.update(id, data);
    revalidatePath("/dashboard/admin/pengampu");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (updatePengampu):", error);
    return { success: false, error: error.message || "Gagal memperbarui penugasan" };
  }
}

/**
 * deletePengampuAction - Server Action to delete teacher assignment.
 */
export async function deletePengampuAction(id) {
  try {
    await PengampuService.delete(id);
    revalidatePath("/dashboard/admin/pengampu");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deletePengampu):", error);
    return { success: false, error: error.message || "Gagal menghapus penugasan" };
  }
}

/**
 * updatePengampuBulkAction - Update multiple assignments at once.
 */
export async function updatePengampuBulkAction(items) {
  try {
    await PengampuService.updateBulk(items);
    revalidatePath("/dashboard/admin/pengampu");
    return { success: true };
  } catch (error) {
    console.error("Action Error (updatePengampuBulk):", error);
    return { success: false, error: error.message || "Gagal memperbarui data" };
  }
}

/**
 * getStudentMapelsAction - Fetch subjects for a student's class.
 */
export async function getStudentMapelsAction(kelasId) {
  try {
    if (!kelasId) throw new Error("Kelas ID is required");
    const data = await PengampuService.getByKelasId(kelasId);
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getStudentMapels):", error);
    return { success: false, error: error.message || "Gagal mengambil data mapel" };
  }
}

/**
 * getSubjectDetailAction - Fetch precise assignment for subject & class.
 */
export async function getSubjectDetailAction(kelasId, mapelId) {
  try {
    if (!kelasId || !mapelId) throw new Error("ID Kelas & Mapel diperlukan");
    const data = await PengampuService.getAssignment(kelasId, mapelId);
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getSubjectDetail):", error);
    return { success: false, error: error.message || "Gagal mengambil detail mapel" };
  }
}

/**
 * getTeacherMapelsAction - Fetch subjects for a specific teacher.
 */
export async function getTeacherMapelsAction(teacherId) {
  try {
    if (!teacherId) throw new Error("Teacher ID is required");
    const data = await PengampuService.getByTeacherId(teacherId);
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getTeacherMapels):", error);
    return { success: false, error: error.message || "Gagal mengambil data mapel" };
  }
}

/**
 * getTeacherStudentsAction - Fetch all students taught by a specific teacher.
 */
export async function getTeacherStudentsAction(teacherId) {
  try {
    if (!teacherId) throw new Error("Teacher ID is required");
    
    // 1. Get all classes assigned to this teacher
    const assignments = await PengampuService.getByTeacherId(teacherId);
    if (!assignments || assignments.length === 0) return { success: true, data: [] };
    
    const kelasIds = [...new Set(assignments.map(a => a.kelasId))];
    
    // 2. Fetch students for these classes
    const data = await SiswaService.getByKelasIds(kelasIds);
    return { success: true, data };
  } catch (error) {
    console.error("Action Error (getTeacherStudents):", error);
    return { success: false, error: error.message || "Gagal mengambil data siswa" };
  }
}
