import { NextResponse } from "next/server";
import { PengampuService } from "@/lib/services/pengampu-service";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const result = await PengampuService.update(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Pengampu Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await PengampuService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Pengampu Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
