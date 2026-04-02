import { NextResponse } from "next/server";
import { SiswaService } from "@/lib/services/siswa-service";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const result = await SiswaService.update(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Siswa Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await SiswaService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Siswa Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
