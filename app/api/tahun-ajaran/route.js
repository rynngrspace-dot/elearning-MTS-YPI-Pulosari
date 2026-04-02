import { NextResponse } from "next/server";
import { TahunAjaranService } from "@/lib/services/tahun-ajaran-service";

export async function GET() {
  try {
    const data = await TahunAjaranService.getAll();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET TahunAjaran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await TahunAjaranService.create(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST TahunAjaran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id } = await req.json();
    await TahunAjaranService.activate(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH TahunAjaran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await TahunAjaranService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE TahunAjaran Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
