"use server";

import prisma from "@/lib/db";
import { comparePassword, setSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Email atau password salah" };
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return { error: "Email atau password salah" };
  }

  await setSession(user);
  
  revalidatePath("/", "layout");

  // Redirect based on role
  let targetPath = "/dashboard";
  if (user.role === "ADMIN") {
    targetPath = "/dashboard/admin";
  } else if (user.role === "TEACHER") {
    targetPath = "/dashboard/guru";
  } else if (user.role === "STUDENT") {
    targetPath = "/dashboard/siswa";
  }

  redirect(targetPath);
}

export async function logoutAction() {
  await logout();
  revalidatePath("/", "layout");
  redirect("/login");
}
