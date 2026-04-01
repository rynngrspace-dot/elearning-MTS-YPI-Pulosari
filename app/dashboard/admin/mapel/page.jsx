import prisma from "@/lib/db";
import MapelClient from "./mapel-client";

export default async function AdminMapelPage() {
  const mapels = await prisma.mataPelajaran.findMany({
    orderBy: { nama: "asc" },
    include: {
      _count: {
        select: { teachers: true }
      }
    }
  });

  return <MapelClient initialData={mapels} />;
}
