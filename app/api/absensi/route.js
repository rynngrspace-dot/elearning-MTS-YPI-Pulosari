import { getSession } from "@/lib/auth";
import { AbsensiService } from "@/lib/services/absensi-service";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const kelasId = searchParams.get("kelasId");
  const mapelId = searchParams.get("mapelId");
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  if (!kelasId || !mapelId || !dateStr) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const students = await AbsensiService.getStudentsByClass(kelasId);
    const date = new Date(dateStr);
    const existing = await AbsensiService.getExistingRecords(kelasId, mapelId, date);

    return NextResponse.json({ students, existing });
  } catch (error) {
    console.error("Fetch absensi students failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const data = await req.json(); // { teacherId, mapelId, kelasId, date, statuses }
      
      // Basic security check: teacherId in body should match session ID profile
      // For now we'll trust the body but in prod we'd resolve session profile ID
      
      const result = await AbsensiService.saveAttendance(data);
      return NextResponse.json({ success: true, result });
    } catch (error) {
      console.error("Save absensi failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
