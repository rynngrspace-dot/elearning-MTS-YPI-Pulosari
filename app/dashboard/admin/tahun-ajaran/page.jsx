import { TahunAjaranService } from "@/lib/services/tahun-ajaran-service";
import TahunAjaranClient from "./TahunAjaranClient";

export const dynamic = "force-dynamic";

export default async function AdminTahunAjaranPage() {
  const years = await TahunAjaranService.getAll();

  return (
    <div className="p-4 md:p-8">
      <TahunAjaranClient initialData={years} />
    </div>
  );
}
