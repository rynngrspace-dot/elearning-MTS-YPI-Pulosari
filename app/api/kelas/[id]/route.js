import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const result = await prisma.kelas.update({
      where: { id },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.kelas.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
