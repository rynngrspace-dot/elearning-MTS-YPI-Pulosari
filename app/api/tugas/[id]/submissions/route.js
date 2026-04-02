import { getSession } from "@/lib/auth";
import { TugasService } from "@/lib/services/tugas-service";
import { NextResponse } from "next/server";

export async function GET(req, props) {
  const params = await props.params;
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions = await TugasService.getSubmissions(params.id);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Fetch submissions failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, props) {
  const params = await props.params;
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { submissionId, score } = await req.json();
    const result = await TugasService.gradeSubmission(submissionId, score);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Grade submission failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
