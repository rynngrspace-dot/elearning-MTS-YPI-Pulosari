"use server";

import { MeetService } from "@/lib/services/meet-service";
import { revalidatePath } from "next/cache";

export async function createMeetingAction(pengampuId, roomName) {
  try {
    const meeting = await MeetService.createMeeting(pengampuId, roomName);
    revalidatePath("/dashboard/guru/meet");
    revalidatePath("/dashboard/siswa/meet");
    return { success: true, data: meeting };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { success: false, error: "Gagal membuat pertemuan" };
  }
}

export async function endMeetingAction(meetingId) {
  try {
    await MeetService.endMeeting(meetingId);
    revalidatePath("/dashboard/guru/meet");
    revalidatePath("/dashboard/siswa/meet");
    return { success: true };
  } catch (error) {
    console.error("Error ending meeting:", error);
    return { success: false, error: "Gagal mengakhiri pertemuan" };
  }
}

export async function getMeetingsForStudentAction(kelasId) {
  try {
    const meetings = await MeetService.getActiveMeetingsByKelas(kelasId);
    return { success: true, data: meetings };
  } catch (error) {
    console.error("Error fetching student meetings:", error);
    return { success: false, error: "Gagal memuat daftar pertemuan" };
  }
}

export async function getTeacherAssignmentsForMeetAction(teacherId) {
  try {
    const assignments = await MeetService.getTeacherAssignmentsWithMeetings(teacherId);
    return { success: true, data: assignments };
  } catch (error) {
    console.error("Error fetching teacher assignments for meet:", error);
    return { success: false, error: "Gagal memuat daftar kelas" };
  }
}
