import prisma from "../db";

/**
 * TahunAjaranService - Domain logic for Academic Year Management.
 */
export const TahunAjaranService = {
  /**
   * getAll - Fetch all academic years.
   */
  async getAll() {
    return await prisma.tahunAjaran.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * getActive - Fetch the currently active academic year.
   */
  async getActive() {
    return await prisma.tahunAjaran.findFirst({
      where: { isActive: true }
    });
  },

  /**
   * create - Create a new academic year with duplicate check.
   */
  async create(data) {
    const { tahun, semester } = data;

    const existing = await prisma.tahunAjaran.findUnique({
      where: {
        tahun_semester: { tahun, semester },
      },
    });

    if (existing) {
      throw new Error(`Tahun Ajaran ${tahun} Semester ${semester} sudah ada.`);
    }

    return await prisma.tahunAjaran.create({
      data: { tahun, semester, isActive: false },
    });
  },

  /**
   * activate - Activate a specific year and deactivate all others.
   */
  async activate(id) {
    const target = await prisma.tahunAjaran.findUnique({ where: { id } });
    if (!target) throw new Error("Tahun Ajaran tidak ditemukan");

    if (target.isActive) return target;

    return await prisma.$transaction(async (tx) => {
      // Deactivate current active
      await tx.tahunAjaran.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      // Activate target
      return await tx.tahunAjaran.update({
        where: { id },
        data: { isActive: true },
      });
    });
  },

  /**
   * delete - Remove an academic year.
   */
  async delete(id) {
    return await prisma.tahunAjaran.delete({
      where: { id }
    });
  }
};
