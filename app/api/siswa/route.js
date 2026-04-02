import { NextResponse } from "next/server";
import { SiswaService } from "@/lib/services/siswa-service";

export async function GET() {
  try {
    const formatted = await SiswaService.getAll();
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Siswa Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await SiswaService.create(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST Siswa Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
