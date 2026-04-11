import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { getTeacherAssignmentsForMeetAction } from "@/lib/actions/meet-actions";
import TeacherMeetClient from "./TeacherMeetClient";

export default async function TeacherMeetPage() {
  const session = await getSession();

  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.id },
    select: { id: true }
  });

  if (!teacher) {
    redirect("/dashboard/guru");
  }

  const res = await getTeacherAssignmentsForMeetAction(teacher.id);
  
  return (
    <TeacherMeetClient 
      initialAssignments={res.success ? res.data : []} 
      teacherId={teacher.id}
    />
  );
}