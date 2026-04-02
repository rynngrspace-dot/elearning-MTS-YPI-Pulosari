import { SiswaService } from "@/lib/services/siswa-service";
import { KelasService } from "@/lib/services/kelas-service";
import SiswaClient from "./SiswaClient";

export const dynamic = "force-dynamic";

export default async function AdminSiswaPage() {
  const [formattedStudents, kelasList] = await Promise.all([
    SiswaService.getAll(),
    KelasService.getAll()
  ]);

  return <SiswaClient initialStudents={formattedStudents} kelasList={kelasList} />;
}
