import prisma from "../db";

/**
 * PengampuService - Domain logic for Subject Assignment (Pengampu) Management.
 * Manages the link between Teacher, Subject, Class, and Academic Year.
 */
export const PengampuService = {
  /**
   * getAll - Fetch all assignments with related data.
   */
  async getAll() {
    return await prisma.pengampu.findMany({
      include: {
        teacher: { include: { user: true } },
        mapel: true,
        kelas: true,
        tahunAjaran: true,
      },
      orderBy: [
        { tahunAjaran: { tahun: 'desc' } },
        { kelas: { nama: 'asc' } }
      ]
    });
  },

  /**
   * getById - Fetch a single assignment by ID.
   */
  async getById(id) {
    return await prisma.pengampu.findUnique({
      where: { id },
      include: {
        teacher: { include: { user: true } },
        mapel: true,
        kelas: true,
        tahunAjaran: true,
      }
    });
  },

  /**
   * create - Assign a teacher to a subject and class.
   */
  async create(data) {
    return await prisma.pengampu.create({
      data: {
        teacherId: data.teacherId,
        mapelId: data.mapelId,
        kelasId: data.kelasId,
        tahunAjaranId: data.tahunAjaranId,
        hari: data.hari || null,
        jamMulai: data.jamMulai || null,
        jamSelesai: data.jamSelesai || null,
      }
    });
  },

  /**
   * update - Update assignment details.
   */
  async update(id, data) {
    return await prisma.pengampu.update({
      where: { id },
      data: {
        teacherId: data.teacherId,
        mapelId: data.mapelId,
        kelasId: data.kelasId,
        tahunAjaranId: data.tahunAjaranId,
        hari: data.hari || null,
        jamMulai: data.jamMulai || null,
        jamSelesai: data.jamSelesai || null,
      }
    });
  },

  /**
   * delete - Remove an assignment.
   */
  async delete(id) {
    return await prisma.pengampu.delete({
      where: { id }
    });
  },

  /**
   * updateBulk - Update multiple assignments (schedule and mapping).
   */
  async updateBulk(items) {
    return await prisma.$transaction(
      items.map(item => prisma.pengampu.update({
        where: { id: item.id },
        data: {
          mapelId: item.mapelId,
          kelasId: item.kelasId,
          hari: item.hari || null,
          jamMulai: item.jamMulai || null,
          jamSelesai: item.jamSelesai || null,
        }
      }))
    );
  },

  /**
   * getByKelasId - Fetch all assignments for a specific class.
   */
  async getByKelasId(kelasId) {
    return await prisma.pengampu.findMany({
      where: { kelasId },
      include: {
        mapel: true,
        teacher: { include: { user: true } },
        tahunAjaran: true,
      },
      orderBy: {
        mapel: { nama: 'asc' }
      }
    });
  },

  /**
   * getByTeacherId - Fetch all assignments for a specific teacher.
   */
  async getByTeacherId(teacherId) {
    return await prisma.pengampu.findMany({
      where: { teacherId },
      include: {
        mapel: true,
        kelas: true,
        tahunAjaran: true,
      },
      orderBy: {
        mapel: { nama: 'asc' }
      }
    });
  },

  /**
   * getAssignment - Fetch specific assignment details.
   */
  async getAssignment(kelasId, mapelId) {
    return await prisma.pengampu.findFirst({
      where: { 
        kelasId,
        mapelId
      },
      include: {
        mapel: true,
        teacher: { include: { user: true } },
        kelas: true,
      }
    });
  },

  /**
   * bulkDelete - Remove multiple assignments at once.
   */
  async bulkDelete(ids) {
    if (!ids || ids.length === 0) return { count: 0 };
    
    return await prisma.pengampu.deleteMany({
      where: { id: { in: ids } }
    });
  }
};
