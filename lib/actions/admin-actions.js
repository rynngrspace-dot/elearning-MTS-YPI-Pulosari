"use server";

import prisma from "../db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getAdminsAction() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: admins };
  } catch (error) {
    console.error("Action Error (getAdmins):", error);
    return { success: false, error: error.message || "Gagal mengambil data admin" };
  }
}

export async function createAdminAction(data) {
  try {
    if (!data.username || !data.password || !data.name) {
      throw new Error("Semua kolom wajib diisi");
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUser) {
      throw new Error("Username/Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    revalidatePath("/dashboard/admin/admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (createAdmin):", error);
    return { success: false, error: error.message || "Gagal menambahkan admin" };
  }
}

export async function updateAdminAction(id, data) {
  try {
    if (!data.username || !data.name) {
      throw new Error("Nama dan Username wajib diisi");
    }

    // Check if username already exists for another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: data.username,
        NOT: { id },
      },
    });
    if (existingUser) {
      throw new Error("Username/Email sudah digunakan");
    }

    const updateData = {
      username: data.username,
      name: data.name,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const result = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/admin/admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action Error (updateAdmin):", error);
    return { success: false, error: error.message || "Gagal memperbarui admin" };
  }
}

export async function deleteAdminAction(id, currentAdminId) {
  try {
    if (id === currentAdminId) {
      throw new Error("Anda tidak dapat menghapus akun Anda sendiri");
    }

    // Count how many admins are left
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount <= 1) {
      throw new Error("Harus ada minimal satu akun admin di sistem");
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/admin");
    return { success: true };
  } catch (error) {
    console.error("Action Error (deleteAdmin):", error);
    return { success: false, error: error.message || "Gagal menghapus admin" };
  }
}
