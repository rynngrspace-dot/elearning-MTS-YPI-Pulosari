import { NextResponse } from "next/server";
import { MapelService } from "@/lib/services/mapel-service";

export async function GET() {
  try {
    const mapels = await MapelService.getAll();
    return NextResponse.json(mapels);
  } catch (error) {
    console.error("GET Mapel Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await MapelService.create(data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("POST Mapel Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, ...data } = await req.json();
    const result = await MapelService.update(id, data);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("PATCH Mapel Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await MapelService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Mapel Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
