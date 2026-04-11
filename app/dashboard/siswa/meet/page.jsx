import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { getMeetingsForStudentAction } from "@/lib/actions/meet-actions";
import StudentMeetClient from "./StudentMeetClient";

export default async function StudentMeetPage() {
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.id },
    select: { id: true, kelasId: true }
  });

  if (!student || !student.kelasId) {
    redirect("/dashboard/siswa");
  }

  const res = await getMeetingsForStudentAction(student.kelasId);
  
  return (
    <StudentMeetClient 
      initialMeetings={res.success ? res.data : []} 
      kelasId={student.kelasId}
    />
  );
}
