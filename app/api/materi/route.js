import { getSession } from "@/lib/auth";
import { MateriService } from "@/lib/services/materi-service";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mapelId = searchParams.get("mapelId");
  const kelasId = searchParams.get("kelasId");

  try {
    const materials = await MateriService.getMateri(session.teacherId || session.id, { mapelId, kelasId });
    return NextResponse.json(materials);
  } catch (error) {
    console.error("Fetch materials failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const result = await MateriService.createMateri(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create materi failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const result = await MateriService.deleteMateri(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete materi failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
