import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const kelas = await prisma.kelas.findMany({
      include: {
        _count: {
          select: { students: true }
        }
      },
      orderBy: { nama: 'asc' }
    });
    return NextResponse.json(kelas);
  } catch (error) {
    console.error("GET Kelas Error:", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await prisma.kelas.create({
      data: {
        nama: data.nama,
        tingkat: data.tingkat,
        waliKelasId: data.waliKelasId || null,
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
