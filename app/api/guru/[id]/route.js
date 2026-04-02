import { NextResponse } from "next/server";
import { GuruService } from "@/lib/services/guru-service";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const result = await GuruService.update(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Guru Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await GuruService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Guru Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
