import { NextResponse } from "next/server";
import { PengampuService } from "@/lib/services/pengampu-service";

export async function GET() {
  try {
    const pengampu = await PengampuService.getAll();
    return NextResponse.json(pengampu);
  } catch (error) {
    console.error("GET Pengampu Error:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await PengampuService.create(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST Pengampu Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
