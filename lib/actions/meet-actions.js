"use server";

import { MeetService } from "@/lib/services/meet-service";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

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

export async function getMeetingByIdAction(meetingId) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        pengampu: {
          include: {
            mapel: true,
            kelas: true,
            teacher: {
              include: { user: true }
            }
          }
        }
      }
    });
    return { success: true, data: meeting };
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return { success: false, error: "Gagal memuat detail pertemuan" };
  }
}

export async function pingMeetAttendanceAction(meetingId, studentId) {
  try {
    const existing = await prisma.meetAttendance.findUnique({
      where: {
        meetingId_studentId: { meetingId, studentId }
      }
    });

    if (existing) {
      await prisma.meetAttendance.update({
        where: { id: existing.id },
        data: {
          lastSeen: new Date(),
          duration: existing.duration + 30
        }
      });
    } else {
      await prisma.meetAttendance.create({
        data: {
          meetingId,
          studentId,
          duration: 30
        }
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error pinging meet attendance:", error);
    return { success: false, error: "Gagal mengirim status aktif" };
  }
}

export async function getMeetAttendanceListAction(meetingId) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        pengampu: {
          select: { kelasId: true }
        }
      }
    });

    if (!meeting || !meeting.pengampu.kelasId) {
      return { success: false, error: "Pertemuan tidak ditemukan" };
    }

    const students = await prisma.student.findMany({
      where: { kelasId: meeting.pengampu.kelasId },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: {
        user: { name: "asc" }
      }
    });

    const logs = await prisma.meetAttendance.findMany({
      where: { meetingId }
    });

    const logMap = new Map(logs.map(log => [log.studentId, log]));
    const now = new Date();

    const list = students.map(student => {
      const log = logMap.get(student.id);
      let status = "Absent";
      let activeMinutes = 0;

      if (log) {
        activeMinutes = Math.round(log.duration / 60);
        
        const lastSeenTime = new Date(log.lastSeen).getTime();
        // Sentinel value for Pasif: epoch time 0 (1970-01-01)
        if (lastSeenTime === 0) {
          status = "Idle"; // Pasif
        } else {
          const diffMs = now - new Date(log.lastSeen);
          if (diffMs < 90000) {
            status = "Active";
          } else {
            status = "Absent"; // Closed tab / timed out -> goes back to Absent (Red)
          }
        }
      }

      return {
        studentId: student.id,
        name: student.user?.name || "Siswa",
        nisn: student.nisn,
        status,
        lastSeen: log ? log.lastSeen : null,
        duration: activeMinutes
      };
    });

    return { success: true, data: list };
  } catch (error) {
    console.error("Error fetching meet attendance list:", error);
    return { success: false, error: "Gagal memuat absensi kelas" };
  }
}

export async function leaveMeetAttendanceAction(meetingId, studentId) {
  try {
    const existing = await prisma.meetAttendance.findUnique({
      where: {
        meetingId_studentId: { meetingId, studentId }
      }
    });

    if (existing) {
      await prisma.meetAttendance.update({
        where: { id: existing.id },
        data: {
          lastSeen: new Date(Date.now() - 120000) // set lastSeen to 120 seconds ago to trigger Absent immediately
        }
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error marking leave:", error);
    return { success: false };
  }
}

export async function markMeetAttendancePasifAction(meetingId, studentId) {
  try {
    const existing = await prisma.meetAttendance.findUnique({
      where: {
        meetingId_studentId: { meetingId, studentId }
      }
    });

    if (existing) {
      await prisma.meetAttendance.update({
        where: { id: existing.id },
        data: {
          lastSeen: new Date(0) // set lastSeen to epoch 0 to trigger Pasif immediately
        }
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error marking pasif:", error);
    return { success: false };
  }
}

