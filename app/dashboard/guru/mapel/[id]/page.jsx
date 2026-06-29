import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { PengampuService } from "@/lib/services/pengampu-service";
import {
  FileText,
  ClipboardList,
  Video,
  ChevronLeft,
  School,
  CalendarClock,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default async function TeacherSubjectDetailPage(props) {
  const params = await props.params;
  const session = await getSession();

  // 1. Auth Guard
  if (!session || session.role !== "TEACHER") {
    redirect("/login");
  }

  // 2. Resolve Assignment
  const assignment = await PengampuService.getById(params.id);

  if (!assignment) {
    redirect("/dashboard/guru/mapel");
  }

  // 3. Count students in this class
  const studentCount = await prisma.student.count({
    where: { kelasId: assignment.kelasId }
  });

  const menuCards = [
    {
      title: "Materi",
      icon: FileText,
      href: `/dashboard/guru/materi?mapelId=${assignment.mapelId}&kelasId=${assignment.kelasId}`
    },
    {
      title: "Tugas",
      icon: ClipboardList,
      href: `/dashboard/guru/tugas?mapelId=${assignment.mapelId}&kelasId=${assignment.kelasId}`
    },
    {
      title: "Jitsi Meet",
      icon: Video,
      href: `/dashboard/guru/meet`
    },
  ];

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/guru/mapel"
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-ink-3 hover:text-indigo transition-colors"
        >
          <ChevronLeft size={14} /> Kembali
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-surface border border-border rounded-[32px] overflow-hidden shadow-card">
        <div className="px-8 py-5 border-b border-border bg-cream/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo border border-indigo/10 shadow-inner">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Mata Pelajaran</p>
              <h1 className="text-xl font-black text-ink uppercase tracking-tight">
                {assignment.mapel.nama}
              </h1>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo text-[10px] font-black rounded-lg uppercase tracking-widest">
            {assignment.tahunAjaran.tahun} ({assignment.tahunAjaran.semester})
          </span>
        </div>

        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo border border-indigo/10 shadow-inner">
              <School size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Unit Kelas</p>
              <p className="text-[15px] font-black text-ink">{assignment.kelas.nama} · {studentCount} Siswa</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo border border-indigo/10 shadow-inner">
              <CalendarClock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest opacity-60">Jadwal Sesi</p>
              <p className="text-[15px] font-black text-ink">
                {assignment.hari ? `${assignment.hari}, ${assignment.jamMulai} - ${assignment.jamSelesai}` : "Belum Diatur"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {menuCards.map((card, idx) => (
          <Link key={idx} href={card.href} className="group">
            <div className="bg-white border border-border rounded-[32px] flex flex-col items-center justify-center py-10 px-6 gap-6 transition-all hover:shadow-xl hover:-translate-y-1.5 group-hover:border-indigo duration-300 shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-cream group-hover:bg-indigo-light/20 flex items-center justify-center text-ink-3 group-hover:text-indigo transition-all duration-500 ring-0 group-hover:ring-4 ring-indigo/5">
                <card.icon size={32} strokeWidth={2} />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="text-lg font-black text-ink uppercase tracking-tight">{card.title}</h3>
                <div className="w-8 h-0.5 bg-indigo rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-2 text-ink-3/40 mt-4">
        <div className="w-8 h-px bg-border" />
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">E-Learning MTS YPI Pulosari</span>
        <div className="w-8 h-px bg-border" />
      </div>
    </div>
  );
}
