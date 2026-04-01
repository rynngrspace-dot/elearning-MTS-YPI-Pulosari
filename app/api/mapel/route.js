import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mapels = await prisma.mataPelajaran.findMany({
      orderBy: { nama: "asc" },
      include: {
        _count: {
          select: { teachers: true }
        }
      }
    });
    return NextResponse.json(mapels);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { nama, kode, kelompok } = await req.json();

    if (!nama) {
      return NextResponse.json({ error: "Nama mata pelajaran wajib diisi" }, { status: 400 });
    }

    // Cek duplikasi nama atau kode
    const existing = await prisma.mataPelajaran.findFirst({
      where: {
        OR: [
          { nama },
          kode ? { kode } : {}
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Mata pelajaran dengan nama/kode tersebut sudah ada" }, { status: 400 });
    }

    const mapel = await prisma.mataPelajaran.create({
      data: { nama, kode, kelompok }
    });

    return NextResponse.json({ success: true, data: mapel });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, nama, kode, kelompok } = await req.json();

    const mapel = await prisma.mataPelajaran.update({
      where: { id },
      data: { nama, kode, kelompok }
    });

    return NextResponse.json({ success: true, data: mapel });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Cek apakah ada guru yang mengampu mapel ini
    const usage = await prisma.teacher.count({
      where: { mapelId: id }
    });

    if (usage > 0) {
      return NextResponse.json({ error: "Tidak dapat menghapus mapel yang sedang diampu oleh guru" }, { status: 400 });
    }

    await prisma.mataPelajaran.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
