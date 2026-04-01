import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        kelas: true,
      },
      orderBy: {
        user: { name: 'asc' }
      }
    });

    // Format data for frontend
    const formatted = students.map(s => ({
      id: s.id,
      nisn: s.nisn,
      nis: s.nis,
      nik: s.nik,
      nama: s.user.name,
      username: s.user.username,
      kelas: s.kelas?.nama || "Tanpa Kelas",
      kelasId: s.kelasId,
      gender: s.gender,
      status: s.status,
      tempatLahir: s.tempatLahir,
      tanggalLahir: s.tanggalLahir,
      alamat: s.alamat,
      asalSD: s.asalSD,
      namaAyah: s.namaAyah,
      namaIbu: s.namaIbu,
      noHpOrangTua: s.noHpOrangTua,
      tahunMasuk: s.tahunMasuk,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Siswa Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const hashedPassword = await bcrypt.hash("123", 10); // Default password

    const result = await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          username: data.nisn, // Use NISN as username
          password: hashedPassword,
          name: data.nama,
          role: 'STUDENT',
        }
      });

      // Create student profile
      return await tx.student.create({
        data: {
          userId: user.id,
          nisn: data.nisn,
          nis: data.nis,
          nik: data.nik,
          gender: data.gender,
          status: data.status || "Aktif",
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          asalSD: data.asalSD,
          namaAyah: data.namaAyah,
          namaIbu: data.namaIbu,
          noHpOrangTua: data.noHpOrangTua,
          tahunMasuk: data.tahunMasuk,
          kelasId: data.kelasId || null,
        },
        include: { user: true, kelas: true }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST Siswa Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
