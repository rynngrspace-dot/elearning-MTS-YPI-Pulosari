import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { getMeetingByIdAction } from "@/lib/actions/meet-actions";
import StudentRoomClient from "./StudentRoomClient";

export default async function StudentRoomPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.id },
    select: { id: true }
  });

  if (!student) {
    redirect("/dashboard/siswa");
  }

  const res = await getMeetingByIdAction(id);
  if (!res.success || !res.data) {
    redirect("/dashboard/siswa/meet");
  }

  return (
    <StudentRoomClient 
      meeting={res.data}
      studentId={student.id}
      userName={session.name}
    />
  );
}
