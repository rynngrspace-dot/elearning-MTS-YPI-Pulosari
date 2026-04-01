import prisma from "@/lib/db";
import TahunAjaranClient from "./TahunAjaranClient";

export const dynamic = "force-dynamic";

export default async function AdminTahunAjaranPage() {
  const years = await prisma.tahunAjaran.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8">
      <TahunAjaranClient initialData={years} />
    </div>
  );
}
