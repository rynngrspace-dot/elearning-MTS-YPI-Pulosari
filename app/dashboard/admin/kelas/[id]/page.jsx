import { SiswaService } from "@/lib/services/siswa-service";
import { KelasService } from "@/lib/services/kelas-service";
import KelasDetailClient from "./KelasDetailClient";
import Link from "next/link";
import { ChevronLeft, School } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KelasDetailPage({ params }) {
  const { id } = await params;
  
  const [data, unassignedStudents] = await Promise.all([
    KelasService.getById(id),
    SiswaService.getUnassigned()
  ]);

  if (!data) {
    return (
      <div className="p-12 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center text-ink-3 mx-auto mb-6">
          <School size={40} />
        </div>
        <h1 className="text-2xl font-black text-ink uppercase tracking-tight">Kelas Tidak Ditemukan</h1>
        <p className="text-sm text-ink-3 font-bold uppercase tracking-widest mt-2 mb-8">Maaf, data rombel yang Anda cari tidak tersedia.</p>
        <Link href="/dashboard/admin/kelas" className="px-8 py-3.5 bg-indigo text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo/20 cursor-pointer">
          Kembali ke Daftar Kelas
        </Link>
      </div>
    );
  }

  return (
    <KelasDetailClient 
      kelasData={data} 
      unassignedStudents={unassignedStudents} 
    />
  );
}
