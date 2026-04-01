import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const result = await prisma.pengampu.update({
      where: { id },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.pengampu.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
