import prisma from "@/lib/db";

export class MeetService {
  /**
   * Create a new meeting session
   */
  static async createMeeting(pengampuId, roomName) {
    // End any existing active meetings for this pengampu
    await prisma.meeting.updateMany({
      where: {
        pengampuId,
        status: "ACTIVE",
      },
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    return await prisma.meeting.create({
      data: {
        pengampuId,
        roomName,
        status: "ACTIVE",
        startedAt: new Date(),
      },
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
  }

  /**
   * End an active meeting
   */
  static async endMeeting(meetingId) {
    return await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });
  }

  /**
   * Get active meetings for a student's class
   */
  static async getActiveMeetingsByKelas(kelasId) {
    return await prisma.meeting.findMany({
      where: {
        status: "ACTIVE",
        pengampu: {
          kelasId: kelasId,
        },
      },
      include: {
        pengampu: {
          include: {
            mapel: true,
            teacher: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: {
        startedAt: "desc"
      }
    });
  }

  /**
   * Get all teaching assignments for a teacher with their active meetings
   */
  static async getTeacherAssignmentsWithMeetings(teacherId) {
    const assignments = await prisma.pengampu.findMany({
      where: { teacherId },
      include: {
        mapel: true,
        kelas: true,
        meetings: {
          where: { status: "ACTIVE" },
          take: 1
        }
      },
      orderBy: [
        { hari: 'asc' },
        { jamMulai: 'asc' }
      ]
    });

    return assignments;
  }
}
