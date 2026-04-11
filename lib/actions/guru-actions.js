"use server";

import { GuruService } from "../services/guru-service";
import { revalidatePath } from "next/cache";

/**
 * createGuruAction - Server Action to handle new teacher registration.
 */
export async function createGuruAction(data) {
  try {
    const result = await GuruService.create(data);
    revalidatePath("/dashboard/admin/guru");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createGuru):", error);
    return { success: false, error: error.message || "Gagal menambahkan guru" };
  }
}

/**
 * updateGuruAction - Server Action to update teacher profile.
 */
export async function updateGuruAction(id, data) {
  try {
    const result = await GuruService.update(id, data);
    revalidatePath("/dashboard/admin/guru");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (updateGuru):", error);
    return { success: false, error: error.message || "Gagal memperbarui guru" };
  }
}

/**
 * deleteGuruAction - Server Action to delete teacher.
 */
export async function deleteGuruAction(id) {
  try {
    await GuruService.delete(id);
    revalidatePath("/dashboard/admin/guru");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deleteGuru):", error);
    return { success: false, error: error.message || "Gagal menghapus guru" };
  }
}

/**
 * bulkDeleteGuruAction - Server Action to remove multiple teachers at once.
 * @param {string[]} ids - Array of Teacher IDs
 */
export async function bulkDeleteGuruAction(ids) {
  try {
    const result = await GuruService.bulkDelete(ids);
    revalidatePath("/dashboard/admin/guru");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (bulkDeleteGuru):", error);
    return { success: false, error: error.message || "Gagal menghapus data massal" };
  }
}
