import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMeetingByIdAction } from "@/lib/actions/meet-actions";
import TeacherRoomClient from "./TeacherRoomClient";

export default async function TeacherRoomPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  const res = await getMeetingByIdAction(id);
  if (!res.success || !res.data) {
    redirect("/dashboard/guru/meet");
  }

  return (
    <TeacherRoomClient 
      meeting={res.data}
      userName={session.name}
    />
  );
}
