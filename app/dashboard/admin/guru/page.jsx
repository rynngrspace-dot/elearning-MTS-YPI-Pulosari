import { GuruService } from "@/lib/services/guru-service";
import { MapelService } from "@/lib/services/mapel-service";
import GuruClient from "./GuruClient";

export const dynamic = "force-dynamic";

export default async function AdminGuruPage() {
  const [formattedTeachers, mapelList] = await Promise.all([
    GuruService.getAll(),
    MapelService.getAll()
  ]);

  return <GuruClient initialTeachers={formattedTeachers} mapelList={mapelList} />;
}
