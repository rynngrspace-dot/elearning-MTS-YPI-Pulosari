import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        mataPelajaran: true,
      },
      orderBy: { user: { name: 'asc' } }
    });

    const formatted = teachers.map(t => ({
      id: t.id,
      nip: t.nip,
      nik: t.nik,
      nama: t.user.name,
      username: t.user.username,
      gender: t.gender,
      noHp: t.noHp,
      alamat: t.alamat,
      tempatLahir: t.tempatLahir,
      tanggalLahir: t.tanggalLahir,
      pendidikan: t.pendidikan,
      status: t.status,
      mapelId: t.mapelId,
      mapel: t.mataPelajaran?.nama || "Umum",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Guru Error:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const hashedPassword = await bcrypt.hash("123", 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.nip || data.nama.toLowerCase().replace(/\s/g, ''),
          password: hashedPassword,
          name: data.nama,
          role: 'TEACHER',
        }
      });

      return await tx.teacher.create({
        data: {
          userId: user.id,
          nip: data.nip,
          nik: data.nik,
          gender: data.gender,
          noHp: data.noHp,
          alamat: data.alamat,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          pendidikan: data.pendidikan,
          status: data.status || "PNS",
          mapelId: data.mapelId || null,
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST Guru Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
