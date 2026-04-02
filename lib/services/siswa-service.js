import prisma from "../db";
import bcrypt from "bcryptjs";

/**
 * SiswaService - Domain logic for Student Management.
 */
export const SiswaService = {
  /**
   * getAll - Fetch all students with profile and class data.
   */
  async getAll() {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        kelas: true,
      },
      orderBy: {
        user: { name: 'asc' }
      }
    });

    return students.map(s => this.format(s));
  },

  /**
   * getById - Fetch a single student by ID.
   */
  async getById(id) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        kelas: true,
      }
    });

    return student ? this.format(student) : null;
  },

  /**
   * create - Create a new student (System User + Student Profile).
   */
  async create(data) {
    const hashedPassword = await bcrypt.hash("123", 10); // Default Password

    return await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          username: data.nisn, // Use NISN as username
          password: hashedPassword,
          name: data.nama,
          role: 'STUDENT',
        }
      });

      // Create student profile
      return await tx.student.create({
        data: {
          userId: user.id,
          nisn: data.nisn,
          nis: data.nis,
          nik: data.nik,
          gender: data.gender,
          status: data.status || "Aktif",
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          asalSD: data.asalSD,
          namaAyah: data.namaAyah,
          namaIbu: data.namaIbu,
          noHpOrangTua: data.noHpOrangTua,
          tahunMasuk: data.tahunMasuk,
          kelasId: data.kelasId || null,
        }
      });
    });
  },

  /**
   * update - Update student and user profile.
   */
  async update(id, data) {
    return await prisma.$transaction(async (tx) => {
      const student = await tx.student.update({
        where: { id },
        data: {
          nisn: data.nisn,
          nis: data.nis,
          nik: data.nik,
          gender: data.gender,
          status: data.status,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          asalSD: data.asalSD,
          namaAyah: data.namaAyah,
          namaIbu: data.namaIbu,
          noHpOrangTua: data.noHpOrangTua,
          tahunMasuk: data.tahunMasuk,
          kelasId: data.kelasId || null,
        }
      });

      await tx.user.update({
        where: { id: student.userId },
        data: {
          name: data.nama,
          username: data.nisn,
        }
      });

      return student;
    });
  },

  /**
   * delete - Remove student and associated user account.
   */
  async delete(id) {
    const student = await prisma.student.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!student) throw new Error("Siswa tidak ditemukan");

    return await prisma.user.delete({
      where: { id: student.userId }
    });
  },

  /**
   * getUnassigned - Fetch students not currently assigned to any class.
   */
  async getUnassigned() {
    const students = await prisma.student.findMany({
      where: {
        kelasId: null
      },
      include: {
        user: true,
        kelas: true,
      },
      orderBy: {
        user: { name: 'asc' }
      }
    });

    return students.map(s => this.format(s));
  },

  /**
   * assignToKelas - Enroll or unenroll student from a class.
   */
  async assignToKelas(id, kelasId) {
    return await prisma.student.update({
      where: { id },
      data: {
        kelasId: kelasId || null
      }
    });
  },

  /**
   * bulkAssignToKelas - Enroll multiple students at once.
   */
  async bulkAssignToKelas(ids, kelasId) {
    return await prisma.student.updateMany({
      where: {
        id: { in: ids }
      },
      data: {
        kelasId: kelasId || null
      }
    });
  },

  /**
   * format - Transform Prisma model into UI-friendly object.
   */
  format(s) {
    return {
      id: s.id,
      nisn: s.nisn,
      nis: s.nis,
      nik: s.nik,
      nama: s.user.name,
      username: s.user.username,
      kelas: s.kelas?.nama || "Tanpa Kelas",
      kelasId: s.kelasId,
      gender: s.gender,
      status: s.status,
      tempatLahir: s.tempatLahir,
      tanggalLahir: s.tanggalLahir,
      alamat: s.alamat,
      asalSD: s.asalSD,
      namaAyah: s.namaAyah,
      namaIbu: s.namaIbu,
      noHpOrangTua: s.noHpOrangTua,
      tahunMasuk: s.tahunMasuk,
    };
  }
};
