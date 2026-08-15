import prisma from "@/lib/db";
import { comparePassword, setSession, logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username/Email dan password wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    // Set session (this helper already handles setting cookies)
    await setSession(user);

    // RBAC Logic
    let targetPath = "/dashboard";
    if (user.role === "ADMIN") {
      targetPath = "/dashboard/admin";
    } else if (user.role === "TEACHER") {
      targetPath = "/dashboard/guru";
    } else if (user.role === "STUDENT") {
      targetPath = "/dashboard/siswa";
    }

    return NextResponse.json({ success: true, user: { username: user.username, role: user.role }, redirect: targetPath });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
