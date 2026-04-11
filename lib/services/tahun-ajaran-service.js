import prisma from "@/lib/db";

export const TahunAjaranService = {
  /**
   * getActive - Fetches the currently active academic year.
   * There should ideally be only one active year.
   */
  async getActive() {
    return await prisma.tahunAjaran.findFirst({
      where: { isActive: true },
    });
  },

  /**
   * getAll - Fetches all academic years.
   */
  async getAll() {
    return await prisma.tahunAjaran.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * setActive - Sets a specific year as active and deactivates others.
   */
  async setActive(id) {
    // 1. Deactivate all
    await prisma.tahunAjaran.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // 2. Activate target
    return await prisma.tahunAjaran.update({
      where: { id },
      data: { isActive: true },
    });
  }
};
