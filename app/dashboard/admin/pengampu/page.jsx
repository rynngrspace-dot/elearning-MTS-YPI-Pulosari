import { PengampuService } from "@/lib/services/pengampu-service";
import { GuruService } from "@/lib/services/guru-service";
import { MapelService } from "@/lib/services/mapel-service";
import { KelasService } from "@/lib/services/kelas-service";
import { TahunAjaranService } from "@/lib/services/tahun-ajaran-service";
import PengampuClient from "./PengampuClient";

export const dynamic = "force-dynamic";

export default async function AdminPengampuPage() {
  const [
    pengampu,
    teachers,
    mapels,
    kelas,
    academics
  ] = await Promise.all([
    PengampuService.getAll(),
    GuruService.getAllOriginal(),
    MapelService.getAll(),
    KelasService.getAll(),
    TahunAjaranService.getAll()
  ]);

  return (
    <PengampuClient 
      initialData={pengampu}
      teachers={teachers}
      mapels={mapels}
      kelas={kelas}
      academics={academics}
    />
  );
}
