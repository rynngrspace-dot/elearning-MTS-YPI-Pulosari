import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminManagementPage() {
  const [session, admins] = await Promise.all([
    getSession(),
    prisma.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const currentAdminId = session?.id || "";

  // Map to matching layout data structure
  const formattedAdmins = admins.map((admin) => ({
    id: admin.id,
    username: admin.username,
    name: admin.name,
    createdAt: admin.createdAt.toISOString(),
  }));

  return <AdminClient initialAdmins={formattedAdmins} currentAdminId={currentAdminId} />;
}
