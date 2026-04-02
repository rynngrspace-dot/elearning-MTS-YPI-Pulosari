import { NextResponse } from "next/server";
import { GuruService } from "@/lib/services/guru-service";

export async function GET() {
  try {
    const formatted = await GuruService.getAll();
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Guru Error:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await GuruService.create(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST Guru Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
