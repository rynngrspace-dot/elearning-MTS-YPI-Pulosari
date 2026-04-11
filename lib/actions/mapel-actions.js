"use server";

import { MapelService } from "../services/mapel-service";
import { revalidatePath } from "next/cache";

/**
 * createMapelAction - Server Action to create a new subject.
 */
export async function createMapelAction(data) {
  try {
    const result = await MapelService.create(data);
    revalidatePath("/dashboard/admin/mapel");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createMapel):", error);
    return { success: false, error: error.message || "Gagal membuat mata pelajaran" };
  }
}

/**
 * updateMapelAction - Server Action to update subject.
 */
export async function updateMapelAction(id, data) {
  try {
    const result = await MapelService.update(id, data);
    revalidatePath("/dashboard/admin/mapel");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (updateMapel):", error);
    return { success: false, error: error.message || "Gagal memperbarui mata pelajaran" };
  }
}

/**
 * deleteMapelAction - Server Action to delete subject.
 */
export async function deleteMapelAction(id) {
  try {
    await MapelService.delete(id);
    revalidatePath("/dashboard/admin/mapel");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deleteMapel):", error);
    return { success: false, error: error.message || "Gagal menghapus mata pelajaran" };
  }
}

/**
 * bulkDeleteMapelAction - Server Action to remove multiple subjects.
 * @param {string[]} ids - Array of Mapel IDs
 */
export async function bulkDeleteMapelAction(ids) {
  try {
    const result = await MapelService.bulkDelete(ids);
    revalidatePath("/dashboard/admin/mapel");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (bulkDeleteMapel):", error);
    return { success: false, error: error.message || "Gagal menghapus data massal" };
  }
}
