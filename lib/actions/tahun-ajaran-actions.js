"use server";

import { TahunAjaranService } from "../services/tahun-ajaran-service";
import { revalidatePath } from "next/cache";

/**
 * createTahunAjaranAction - Server Action to create a new academic year.
 */
export async function createTahunAjaranAction(data) {
  try {
    const result = await TahunAjaranService.create(data);
    revalidatePath("/dashboard/admin/tahun-ajaran");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createTahunAjaran):", error);
    return { success: false, error: error.message || "Gagal membuat tahun ajaran" };
  }
}

/**
 * activateTahunAjaranAction - Server Action to activate a specific year.
 */
export async function activateTahunAjaranAction(id) {
  try {
    await TahunAjaranService.setActive(id);
    revalidatePath("/dashboard/admin/tahun-ajaran");
    return { success: true };
  } catch (error) {
    console.error("Action Error (activateTahunAjaran):", error);
    return { success: false, error: error.message || "Gagal mengaktifkan tahun ajaran" };
  }
}

/**
 * deleteTahunAjaranAction - Server Action to delete an academic year.
 */
export async function deleteTahunAjaranAction(id) {
  try {
    await TahunAjaranService.delete(id);
    revalidatePath("/dashboard/admin/tahun-ajaran");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deleteTahunAjaran):", error);
    return { success: false, error: error.message || "Gagal menghapus tahun ajaran" };
  }
}
