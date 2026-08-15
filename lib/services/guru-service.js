import prisma from "../db";
import bcrypt from "bcryptjs";

function validateNip(nip) {
  // Jika NIP tidak diisi / kosong, abaikan (karena opsional)
  if (!nip || nip.trim() === "") {
    return;
  }

  const cleanNip = nip.trim();

  // Validasi: Harus berupa angka saja
  if (!/^\d+$/.test(cleanNip)) {
    throw new Error("NIP harus berupa angka saja.");
  }

  // Validasi: Maksimal 18 digit
  if (cleanNip.length > 18) {
    throw new Error("NIP maksimal 18 digit angka.");
  }
}

/**
 * GuruService - Domain logic for Teacher Management.
 */
export const GuruService = {
  /**
   * getAll - Fetch all teachers with profile and subject data.
   */
  async getAll() {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        mataPelajaran: true,
        pengampu: {
          include: {
            mapel: true
          }
        }
      },
      orderBy: {
        user: { name: 'asc' }
      }
    });

    return teachers.map(t => this.format(t));
  },

  /**
   * getAllOriginal - Fetch raw teacher models (for select options, etc).
   */
  async getAllOriginal() {
    return await prisma.teacher.findMany({
      include: { user: true },
      orderBy: { user: { name: 'asc' } }
    });
  },

  /**
   * getById - Fetch a single teacher by ID.
   */
  async getById(id) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        mataPelajaran: true,
        pengampu: {
          include: {
            mapel: true
          }
        }
      }
    });

    return teacher ? this.format(teacher) : null;
  },

  /**
   * create - Create a new teacher (System User + Teacher Profile).
   */
  async create(data) {
    if (!data.nama || data.nama.trim().length < 3) {
      throw new Error("Nama lengkap wajib diisi (minimal 3 karakter).");
    }
    validateNip(data.nip);
    if (data.noHp && (!/^\d+$/.test(data.noHp) || data.noHp.trim().length < 9 || data.noHp.trim().length > 15)) {
      throw new Error("Nomor WhatsApp guru harus berkisar 9 hingga 15 digit angka.");
    }
    const plainPassword = data.password || data.nip; // password kustom, fallback ke NIP
    if (plainPassword.length < 6) {
      throw new Error("Password minimal 6 karakter.");
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    return await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          username: data.nip, // username pakai NIP
          password: hashedPassword,
          name: data.nama,
          role: 'TEACHER',
        }
      });

      // Create teacher profile
      return await tx.teacher.create({
        data: {
          userId: user.id,
          nip: data.nip,
          nik: data.nik,
          gender: data.gender,
          noHp: data.noHp,
          alamat: data.alamat,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          pendidikan: data.pendidikan,
          status: data.status || "PNS",
          mapelId: data.mapelId || null,
        }
      });
    });
  },

  /**
   * update - Update teacher and user profile.
   */
  async update(id, data) {
    if (!data.nama || data.nama.trim().length < 3) {
      throw new Error("Nama lengkap wajib diisi (minimal 3 karakter).");
    }
    validateNip(data.nip);
    if (data.noHp && (!/^\d+$/.test(data.noHp) || data.noHp.trim().length < 9 || data.noHp.trim().length > 15)) {
      throw new Error("Nomor WhatsApp guru harus berkisar 9 hingga 15 digit angka.");
    }

    return await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.update({
        where: { id },
        data: {
          nip: data.nip,
          nik: data.nik,
          gender: data.gender,
          noHp: data.noHp,
          alamat: data.alamat,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          pendidikan: data.pendidikan,
          status: data.status,
          mapelId: data.mapelId || null,
        }
      });

      await tx.user.update({
        where: { id: teacher.userId },
        data: {
          name: data.nama,
          username: data.nip || data.nama.toLowerCase().replace(/\s/g, ''),
        }
      });

      return teacher;
    });
  },

  /**
   * delete - Remove teacher and associated user account.
   */
  async delete(id) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!teacher) throw new Error("Guru tidak ditemukan");

    return await prisma.user.delete({
      where: { id: teacher.userId }
    });
  },

  /**
   * bulkDelete - Remove multiple teachers and their user accounts.
   */
  async bulkDelete(ids) {
    if (!ids || ids.length === 0) return { count: 0 };

    return await prisma.$transaction(async (tx) => {
      // 1. Get user IDs to delete (cascades to Teacher)
      const teachers = await tx.teacher.findMany({
        where: { id: { in: ids } },
        select: { userId: true }
      });

      const userIds = teachers.map(t => t.userId);

      // 2. Delete Users
      return await tx.user.deleteMany({
        where: { id: { in: userIds } }
      });
    });
  },

  /**
   * format - Transform Prisma model into UI-friendly object.
   */
  format(t) {
    const pengampuMapels = t.pengampu?.map(p => p.mapel.nama) || [];
    const primaryMapel = t.mataPelajaran?.nama;
    
    // Combine primary subject specialty and all assigned subjects dynamically
    const allMapels = Array.from(new Set([
      ...(primaryMapel ? [primaryMapel] : []),
      ...pengampuMapels
    ]));

    const mapelDisplay = allMapels.length > 0 ? allMapels.join(", ") : "Umum";

    return {
      id: t.id,
      nip: t.nip,
      nik: t.nik,
      nama: t.user.name,
      username: t.user.username,
      gender: t.gender,
      noHp: t.noHp,
      alamat: t.alamat,
      tempatLahir: t.tempatLahir,
      tanggalLahir: t.tanggalLahir,
      pendidikan: t.pendidikan,
      status: t.status,
      mapelId: t.mapelId,
      mapel: mapelDisplay,
    };
  }
};
