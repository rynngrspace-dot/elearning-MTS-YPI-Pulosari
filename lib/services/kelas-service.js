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
  }
};
