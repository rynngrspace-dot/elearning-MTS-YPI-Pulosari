"use server";

import { KelasService } from "../services/kelas-service";
import { revalidatePath } from "next/cache";

/**
 * createKelasAction - Server Action to create a new class.
 */
export async function createKelasAction(data) {
  try {
    const result = await KelasService.create(data);
    revalidatePath("/dashboard/admin/kelas");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createKelas):", error);
    return { success: false, error: error.message || "Gagal membuat kelas" };
  }
}

/**
 * updateKelasAction - Server Action to update class.
 */
export async function updateKelasAction(id, data) {
  try {
    const result = await KelasService.update(id, data);
    revalidatePath("/dashboard/admin/kelas");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (updateKelas):", error);
    return { success: false, error: error.message || "Gagal memperbarui kelas" };
  }
}

/**
 * deleteKelasAction - Server Action to delete a class.
 */
export async function deleteKelasAction(id) {
  try {
    await KelasService.delete(id);
    revalidatePath("/dashboard/admin/kelas");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deleteKelas):", error);
    return { success: false, error: error.message || "Gagal menghapus kelas" };
  }
}
