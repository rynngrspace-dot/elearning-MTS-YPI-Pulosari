import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      // Update teacher profile
      const teacher = await tx.teacher.update({
        where: { id },
        data: {
          nip: data.nip,
          nik: data.nik,
          gender: data.gender,
          status: data.status,
          mapelId: data.mapelId || null,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          noHp: data.noHp,
          pendidikan: data.pendidikan,
        }
      });

      // Update user name/username
      await tx.user.update({
        where: { id: teacher.userId },
        data: {
          name: data.nama,
          username: data.nip || data.nama?.replace(/\s/g, '').toLowerCase(), // NIP or sanitized name
        }
      });

      return teacher;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Guru Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!teacher) {
      return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: teacher.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Guru Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
