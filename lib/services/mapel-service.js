import prisma from "../db";

/**
 * MapelService - Domain logic for Mata Pelajaran (Subject) Management.
 */
export const MapelService = {
  /**
   * getAll - Fetch all subjects with teacher count.
   */
  async getAll() {
    return await prisma.mataPelajaran.findMany({
      orderBy: { nama: "asc" },
      include: {
        _count: {
          select: { pengampu: true }
        }
      }
    });
  },

  /**
   * getById - Fetch a single subject by ID.
   */
  async getById(id) {
    return await prisma.mataPelajaran.findUnique({
      where: { id },
      include: {
        teachers: {
          include: { user: true }
        }
      }
    });
  },

  /**
   * create - Create a new subject with uniqueness check.
   */
  async create(data) {
    const { nama, kode, kategori } = data;

    // Duplication Check
    const existing = await prisma.mataPelajaran.findFirst({
      where: {
        OR: [
          { nama },
          kode ? { kode } : {}
        ]
      }
    });

    if (existing) {
      throw new Error("Mata pelajaran dengan nama/kode tersebut sudah ada");
    }

    return await prisma.mataPelajaran.create({
      data: { nama, kode, kategori }
    });
  },

  /**
   * update - Update subject details.
   */
  async update(id, data) {
    const { nama, kode, kategori } = data;

    return await prisma.mataPelajaran.update({
      where: { id },
      data: { nama, kode, kategori }
    });
  },

  /**
   * delete - Remove a subject (prevent if in use by teachers).
   */
  async delete(id) {
    // Check usage
    const usage = await prisma.teacher.count({
      where: { mapelId: id }
    });

    if (usage > 0) {
      throw new Error("Tidak dapat menghapus mapel yang sedang diampu oleh guru");
    }

    return await prisma.mataPelajaran.delete({
      where: { id }
    });
  },

  /**
   * bulkDelete - Remove multiple subjects at once.
   */
  async bulkDelete(ids) {
    if (!ids || ids.length === 0) return { count: 0 };

    return await prisma.$transaction(async (tx) => {
      // 1. Check if ANY mapel is in use by teachers
      const usageCount = await tx.teacher.count({
        where: { mapelId: { in: ids } }
      });

      if (usageCount > 0) {
        throw new Error("Beberapa mata pelajaran yang dipilih masih diampu oleh guru dan tidak dapat dihapus.");
      }

      // 2. Perform bulk delete
      return await tx.mataPelajaran.deleteMany({
        where: { id: { in: ids } }
      });
    });
  }
};
