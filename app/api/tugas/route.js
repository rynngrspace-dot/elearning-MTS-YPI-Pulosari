import { getSession } from "@/lib/auth";
import { TugasService } from "@/lib/services/tugas-service";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Utility to extract storage path from a public URL
 */
function getStoragePath(url, bucket = 'tugas') {
  if (!url) return null;
  const parts = url.split(`/public/${bucket}/`);
  return parts.length > 1 ? parts[1] : null;
}

export async function GET(req) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assignments = await TugasService.getTugas(session.teacherId || session.id);
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Fetch assignments failed:", error);
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
    const result = await TugasService.createTugas(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create tugas failed:", error);
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
    
    // 1. Delete from DB and get associated file metadata
    const fileData = await TugasService.deleteTugas(id);
    
    // 2. Perform Storage Cleanup
    if (fileData) {
      const pathsToDelete = [];
      
      // Main task file
      const taskPath = getStoragePath(fileData.fileUrl);
      if (taskPath) pathsToDelete.push(taskPath);
      
      // All submission files
      (fileData.submissions || []).forEach(sub => {
        const subPath = getStoragePath(sub.fileUrl);
        if (subPath) pathsToDelete.push(subPath);
      });

      if (pathsToDelete.length > 0) {
        console.log(`Cloud Cleanup: Removing ${pathsToDelete.length} files for Tugas ${id}`);
        await supabase.storage.from('tugas').remove(pathsToDelete);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tugas failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
