"use server";

import { PengampuService } from "../services/pengampu-service";
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
