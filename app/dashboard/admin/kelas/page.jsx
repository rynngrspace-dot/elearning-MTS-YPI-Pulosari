import { KelasService } from "@/lib/services/kelas-service";
import { GuruService } from "@/lib/services/guru-service";
import KelasClient from "./KelasClient";

export const dynamic = "force-dynamic";

export default async function AdminKelasPage() {
  const [kelasList, teachers] = await Promise.all([
    KelasService.getAll(),
    GuruService.getAllOriginal()
  ]);

  return <KelasClient initialKelas={kelasList} teachers={teachers} />;
}
