import prisma from "../db";

/**
 * MateriService - Business logic for managing teaching materials.
 */
export const MateriService = {
  /**
   * getMateri - Fetches materials for a teacher with optional mapel/kelas filtering.
   */
  async getMateri(teacherId, filters = {}) {
    if (!teacherId) throw new Error("Teacher ID is required");

    const { mapelId, kelasId } = filters;
    const where = { teacherId };

    if (mapelId) where.mapelId = mapelId;
    if (kelasId) where.kelasId = kelasId;

    return await prisma.materi.findMany({
      where,
      include: {
        mapel: true,
        kelas: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * getByKelasId - Fetches recent materials for a specific class for student dashboard.
   */
  async getByKelasId(kelasId, limit = 5) {
    if (!kelasId) throw new Error("Kelas ID is required");

    return await prisma.materi.findMany({
      where: { kelasId },
      include: {
        mapel: true,
        teacher: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  },

  /**
   * createMateri - Saves a new material record.
   */
  async createMateri(data) {
    const { judul, deskripsi, fileUrl, teacherId, mapelId, kelasId } = data;

    if (!judul || !teacherId || !mapelId || !kelasId) {
      throw new Error("Missing required fields for Materi creation");
    }

    return await prisma.materi.create({
      data: {
        judul,
        deskripsi,
        fileUrl, // Optional URL (Cloudinary/Supabase/etc.)
        teacherId,
        mapelId,
        kelasId
      },
      include: {
        mapel: true,
        kelas: true
      }
    });
  },

  /**
   * deleteMateri - Deletes a specific material record.
   */
  async deleteMateri(id) {
    if (!id) throw new Error("Materi ID is required for deletion");

    return await prisma.materi.delete({
      where: { id }
    });
  }
};
