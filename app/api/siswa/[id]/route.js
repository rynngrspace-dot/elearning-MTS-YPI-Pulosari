import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      // Update student profile first
      const student = await tx.student.update({
        where: { id },
        data: {
          nisn: data.nisn,
          nis: data.nis,
          nik: data.nik,
          gender: data.gender,
          status: data.status,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          asalSD: data.asalSD,
          namaAyah: data.namaAyah,
          namaIbu: data.namaIbu,
          noHpOrangTua: data.noHpOrangTua,
          tahunMasuk: data.tahunMasuk,
          kelasId: data.kelasId || null,
        }
      });

      // Update user name/username
      await tx.user.update({
        where: { id: student.userId },
        data: {
          name: data.nama,
          username: data.nisn,
        }
      });

      return student;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Siswa Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    // Find the student to get the userId
    const student = await prisma.student.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!student) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    // Delete the user (student profile will be deleted via Cascade in schema)
    await prisma.user.delete({
      where: { id: student.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Siswa Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
