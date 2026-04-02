import { NextResponse } from "next/server";
import { KelasService } from "@/lib/services/kelas-service";

export async function GET() {
  try {
    const kelas = await KelasService.getAll();
    return NextResponse.json(kelas);
  } catch (error) {
    console.error("GET Kelas Error:", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await KelasService.create(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST Kelas Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
