import { MapelService } from "@/lib/services/mapel-service";
import MapelClient from "./mapel-client";

export default async function AdminMapelPage() {
  const mapels = await MapelService.getAll();
  return <MapelClient initialData={mapels} />;
}
