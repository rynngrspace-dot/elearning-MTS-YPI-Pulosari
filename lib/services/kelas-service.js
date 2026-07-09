import prisma from "../db";

/**
 * KelasService - Domain logic for Class Management.
 */
export const KelasService = {
  /**
   * getAll - Fetch all classes with student count.
   */
  async getAll() {
    return await prisma.kelas.findMany({
      include: {
        _count: {
          select: { students: true }
        },
        waliKelas: {
          include: { user: true }
        }
      },
      orderBy: { nama: 'asc' }
    });
  },

  /**
   * getById - Fetch a single class by ID.
   */
  async getById(id) {
    return await prisma.kelas.findUnique({
      where: { id },
      include: {
        students: {
          include: { user: true }
        },
        waliKelas: {
          include: { user: true }
        },
      }
    });
  },

  /**
   * create - Create a new class.
   */
  async create(data) {
    if (!data.nama || data.nama.trim().length < 1) {
      throw new Error("Nama kelas wajib diisi.");
    }
    return await prisma.kelas.create({
      data: {
        nama: data.nama,
        tingkat: data.tingkat,
        waliKelasId: data.waliKelasId || null,
      }
    });
  },

  /**
   * update - Update class details.
   */
  async update(id, data) {
    if (!data.nama || data.nama.trim().length < 1) {
      throw new Error("Nama kelas wajib diisi.");
    }
    return await prisma.kelas.update({
      where: { id },
      data: {
        nama: data.nama,
        tingkat: data.tingkat,
        waliKelasId: data.waliKelasId || null,
      }
    });
  },

  /**
   * delete - Remove a class.
   */
  async delete(id) {
    return await prisma.kelas.delete({
      where: { id }
    });
  },

  /**
   * bulkDelete - Remove multiple classes at once.
   */
  async bulkDelete(ids) {
    if (!ids || ids.length === 0) return { count: 0 };

    return await prisma.$transaction(async (tx) => {
      // 1. Check if ANY class has students
      const studentCount = await tx.student.count({
        where: { kelasId: { in: ids } }
      });

      if (studentCount > 0) {
        throw new Error("Beberapa kelas yang dipilih masih memiliki siswa terdaftar. Pindahkan siswa terlebih dahulu sebelum menghapus kelas.");
      }

      // 2. Perform bulk delete
      return await tx.kelas.deleteMany({
        where: { id: { in: ids } }
      });
    });
  }
};
