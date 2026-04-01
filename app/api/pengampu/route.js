import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const pengampu = await prisma.pengampu.findMany({
      include: {
        teacher: { include: { user: true } },
        mapel: true,
        kelas: true,
        tahunAjaran: true,
      },
      orderBy: [
        { tahunAjaran: { tahun: 'desc' } },
        { kelas: { nama: 'asc' } }
      ]
    });
    return NextResponse.json(pengampu);
  } catch (error) {
    console.error("GET Pengampu Error:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await prisma.pengampu.create({
      data: {
        teacherId: data.teacherId,
        mapelId: data.mapelId,
        kelasId: data.kelasId,
        tahunAjaranId: data.tahunAjaranId,
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
