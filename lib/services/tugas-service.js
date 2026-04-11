import prisma from "../db";

/**
 * TugasService - Domain logic for managing assignments and student work.
 */
export const TugasService = {
  /**
   * getTugas - Fetches all assignments created by a teacher.
   */
  async getTugas(teacherId) {
    if (!teacherId) throw new Error("Teacher ID is required");

    return await prisma.tugas.findMany({
      where: { teacherId },
      include: {
        mapel: true,
        kelas: true,
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * createTugas - Saves a new assignment.
   */
  async createTugas(data) {
    const { judul, deskripsi, fileUrl, dueDate, teacherId, mapelId, kelasId } = data;

    if (!judul || !dueDate || !teacherId || !mapelId || !kelasId) {
      throw new Error("Missing required fields for Tugas creation");
    }

    return await prisma.tugas.create({
      data: {
        judul,
        deskripsi,
        fileUrl,
        dueDate: new Date(dueDate),
        teacherId,
        mapelId,
        kelasId
      },
      include: {
        mapel: true,
        kelas: true,
        _count: {
          select: { submissions: true }
        }
      }
    });
  },

  /**
   * deleteTugas - Removes an assignment.
   */
  async deleteTugas(id) {
    if (!id) throw new Error("Tugas ID is required for deletion");
    
    // 1. Fetch Task + All Submission file URLs before deleting DB records
    const files = await prisma.tugas.findUnique({
      where: { id },
      select: {
        fileUrl: true,
        submissions: {
          select: { fileUrl: true }
        }
      }
    });

    // 2. Delete the record (Prisma will handle onDelete: Cascade if configured, otherwise we do it)
    await prisma.tugas.delete({ where: { id } });
    
    return files;
  },

  /**
   * getSubmissions - Fetches all submissions for a specific assignment.
   */
  async getSubmissions(tugasId) {
    if (!tugasId) throw new Error("Tugas ID is required to fetch submissions");

    return await prisma.tugasSubmission.findMany({
      where: { tugasId },
      include: {
        student: {
          include: { user: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
  },

  /**
   * gradeSubmission - Updates the score of a student's submission.
   */
  async gradeSubmission(submissionId, score) {
    if (!submissionId) throw new Error("Submission ID is required");
    
    return await prisma.tugasSubmission.update({
      where: { id: submissionId },
      data: { 
        nilai: score,
        // Remove status field as it doesn't exist in the schema
      }
    });
  },

  /**
   * getTugasForStudent - Fetches all assignments for a class including a specific student's submission.
   */
  async getTugasForStudent(kelasId, studentId) {
    if (!kelasId || !studentId) throw new Error("Kelas ID and Student ID are required");

    return await prisma.tugas.findMany({
      where: { kelasId },
      include: {
        mapel: true,
        teacher: { include: { user: true } },
        submissions: {
          where: { studentId }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * submitTugas - Saves or updates a student assignment submission.
   */
  async submitTugas(data) {
    const { tugasId, studentId, fileUrl } = data;

    if (!tugasId || !studentId) throw new Error("Missing requirement fields for submission");

    return await prisma.tugasSubmission.upsert({
      where: {
        tugasId_studentId: { tugasId, studentId }
      },
      update: {
        fileUrl,
        submittedAt: new Date()
      },
      create: {
        tugasId,
        studentId,
        fileUrl
      }
    });
  }
};
