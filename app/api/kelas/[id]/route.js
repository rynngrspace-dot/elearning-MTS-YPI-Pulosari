import { NextResponse } from "next/server";
import { KelasService } from "@/lib/services/kelas-service";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const result = await KelasService.update(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Kelas Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await KelasService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Kelas Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
