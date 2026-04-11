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
  },

  /**
   * create - Create a new academic year.
   */
  async create(data) {
    // Check for existing year-semester combo
    const existing = await prisma.tahunAjaran.findUnique({
      where: {
        tahun_semester: {
          tahun: data.tahun,
          semester: data.semester
        }
      }
    });

    if (existing) {
      throw new Error(`Tahun Ajaran ${data.tahun} (${data.semester}) sudah terdaftar.`);
    }

    return await prisma.tahunAjaran.create({
      data: {
        tahun: data.tahun,
        semester: data.semester,
        isActive: false // Default to false
      }
    });
  },

  /**
   * delete - Remove an academic year.
   */
  async delete(id) {
    // 1. Check for assignments (pengampu)
    const pengampuCount = await prisma.pengampu.count({ where: { tahunAjaranId: id } });
    if (pengampuCount > 0) throw new Error("Tidak dapat menghapus: Masih ada data penugasan pengampu terkait.");

    // 2. Check for materi
    const materiCount = await prisma.materi.count({ where: { tahunAjaranId: id } });
    if (materiCount > 0) throw new Error("Tidak dapat menghapus: Masih ada data materi terkait.");

    // 3. Check for tugas
    const tugasCount = await prisma.tugas.count({ where: { tahunAjaranId: id } });
    if (tugasCount > 0) throw new Error("Tidak dapat menghapus: Masih ada data tugas terkait.");

    // 4. Check for absensi
    const absensiCount = await prisma.absensi.count({ where: { tahunAjaranId: id } });
    if (absensiCount > 0) throw new Error("Tidak dapat menghapus: Masih ada data absensi terkait.");

    return await prisma.tahunAjaran.delete({
      where: { id }
    });
  }
};
