import { cache } from "react";
import { getSession } from "./auth";
import prisma from "./db";

export const getCurrentUser = cache(async () => {
  try {
    const session = await getSession();
    if (!session || !session.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        studentProfile: true,
        teacherProfile: {
          include: {
            mataPelajaran: true,
          },
        },
      },
    });

    if (!user) return null;

    // Standardize User Metadata
    const name = user.name || user.username || "User";
    
    return {
      ...user,
      // Dynamic Avatar URL
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
      
      // Role-specific Shortcuts for UI
      kelasId: user.studentProfile?.kelasId,
      studentId: user.studentProfile?.id,
      kelas: user.studentProfile?.kelas?.nama || user.studentProfile?.kelas, 
      nisn: user.studentProfile?.nisn,
      mapel: user.teacherProfile?.mataPelajaran?.nama,
      nip: user.teacherProfile?.nip,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
});
