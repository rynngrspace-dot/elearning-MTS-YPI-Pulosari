import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.tahunAjaran.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { tahun, semester } = await req.json();

    if (!tahun || !semester) {
      return NextResponse.json({ error: "Tahun and Semester are required" }, { status: 400 });
    }

    // Bug Fix: Check for duplicates before creating
    const existing = await prisma.tahunAjaran.findUnique({
      where: {
        tahun_semester: { tahun, semester },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Tahun Ajaran ${tahun} Semester ${semester} sudah ada.` },
        { status: 400 }
      );
    }

    await prisma.tahunAjaran.create({
      data: { tahun, semester, isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating Tahun Ajaran:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id } = await req.json();

    const target = await prisma.tahunAjaran.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "Tahun Ajaran tidak ditemukan" }, { status: 404 });
    }

    if (!target.isActive) {
      // Deactivate all others, then activate this one
      await prisma.tahunAjaran.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
      await prisma.tahunAjaran.update({
        where: { id },
        data: { isActive: true },
      });
    } else {
      // Deactivate current
      await prisma.tahunAjaran.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.tahunAjaran.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
