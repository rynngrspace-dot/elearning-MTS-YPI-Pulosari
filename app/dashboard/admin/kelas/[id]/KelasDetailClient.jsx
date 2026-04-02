"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Users, 
  GraduationCap, 
  School,
  IdCard,
  User as UserIcon,
  Search,
  ArrowRight,
  UserPlus,
  Trash2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddStudentModal from "./AddStudentModal";
import { unassignFromKelasAction } from "@/lib/actions/siswa-actions";
import { useToast } from "@/hooks/use-toast";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function KelasDetailClient({ kelasData, unassignedStudents }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToUnassign, setStudentToUnassign] = useState(null);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const { toast } = useToast();

  const handleUnassign = async () => {
    if (!studentToUnassign) return;
    setIsUnassigning(true);
    try {
      const res = await unassignFromKelasAction(studentToUnassign.id, kelasData.id);
      if (res.success) {
        toast({
          title: "Siswa Dikeluarkan",
          description: `${studentToUnassign.nama} telah dikeluarkan dari kelas.`,
          variant: "success",
        });
        setIsConfirmOpen(false);
      } else {
        toast({
          title: "Gagal Mengeluarkan",
          description: res.error || "Terjadi kesalahan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Tidak dapat terhubung ke server.",
        variant: "destructive",
      });
    } finally {
      setIsUnassigning(false);
      setStudentToUnassign(null);
    }
  };

  const openUnassignConfirm = (id, nama) => {
    setStudentToUnassign({ id, nama });
    setIsConfirmOpen(true);
  };

  return (
    <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard/admin/kelas" 
              className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-ink-3 hover:text-indigo-500 hover:border-indigo-200 transition-all shadow-sm group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">Tingkat {kelasData.tingkat}</span>
                <div className="h-1 w-1 rounded-full bg-border" />
                <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest">Detail Rombongan Belajar</p>
              </div>
              <h1 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">{kelasData.nama}</h1>
            </div>
          </div>
          
          <div className="flex gap-4">
             <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-4 bg-indigo-500 text-white rounded-[32px] flex items-center gap-3 shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 transition-all text-[11px] font-black uppercase tracking-widest border border-white/10"
             >
                <UserPlus size={18} strokeWidth={3} />
                Tambah Siswa
             </button>
          </div>
        </div>

        {/* INFO CARDS (CONDENSED) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
           <div className="lg:col-span-2 bg-surface border border-border rounded-[32px] p-6 flex flex-col md:flex-row gap-6 items-center shadow-card relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-110 transition-transform duration-700" />
              <div className="w-16 h-16 rounded-[24px] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
                 <GraduationCap size={32} strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <span className="text-[9px] font-black text-indigo-600/60 uppercase tracking-[0.2em] mb-1 block">Wali Kelas Pengampu</span>
                 <h2 className="text-xl font-black text-ink uppercase tracking-tight mb-1">{kelasData.waliKelas?.user.name || "Belum Ditentukan"}</h2>
                 <p className="text-[11px] text-ink-3 font-medium max-w-md line-clamp-1 opacity-70">Satu-satunya penanggung jawab bimbingan akademik di kelas ini.</p>
              </div>
           </div>

           <div className="bg-ink text-white rounded-[32px] p-6 relative overflow-hidden group shadow-xl">
              <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                 <School size={60} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-3">Statistik Kilas</p>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-white/60 text-[10px] font-bold uppercase tracking-tight">Total Siswa</span>
                          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-500">{kelasData.students?.length || 0}</span>
                       </div>
                       <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <span className="text-white/60 text-[10px] font-bold uppercase tracking-tight">Kapasitas</span>
                          <span className="text-[11px] font-black uppercase tracking-widest">40 Slot</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* STUDENT LIST SECTION */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-4">
           <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-indigo-500 rounded-full" />
              <h3 className="text-lg font-black text-ink uppercase tracking-tight">Daftar Siswa Terdaftar</h3>
           </div>
        </div>

        <div className="bg-surface border border-border rounded-[44px] overflow-hidden shadow-card p-2">
            <div className="overflow-x-auto rounded-[36px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cream/40">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-3">No</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-3">Profil Siswa</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-3">Identitas (NISN)</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-3 text-center">Jenis Kelamin</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {(!kelasData.students || kelasData.students.length === 0) ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center text-ink-3 font-bold uppercase text-[11px] tracking-widest opacity-40 italic">
                         Belum ada siswa yang ditambahkan ke kelas ini
                      </td>
                    </tr>
                  ) : (
                    kelasData.students.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-cream/20 transition-all group">
                        <td className="px-8 py-6">
                           <span className="text-[11px] font-black text-ink-3 uppercase tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner group-hover:rotate-6 transition-transform">
                                 <UserIcon size={20} />
                              </div>
                              <div>
                                 <p className="text-[13px] font-black text-ink uppercase tracking-tight mb-0.5">{s.user.name}</p>
                                 <p className="text-[9px] font-black text-ink-3 uppercase tracking-widest opacity-60">NIS: {s.nis || "---"}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <IdCard size={14} className="text-indigo-500" />
                              <span className="text-[11px] font-black text-ink tabular-nums tracking-wider">{s.nisn}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={cn(
                             "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-xs inline-block min-w-28",
                             s.gender === 'L' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-pink-50 text-pink-600 border-pink-100"
                           )}>
                              {s.gender === 'L' ? "Laki-laki" : "Perempuan"}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button 
                            onClick={() => openUnassignConfirm(s.id, s.user.name)}
                            className="text-[9px] font-black text-ink-3 hover:text-red-500 transition-colors uppercase tracking-widest py-2 px-6 border border-border rounded-xl hover:bg-red-50 hover:border-red-100 shadow-sm bg-surface flex items-center gap-2 ml-auto cursor-pointer"
                           >
                              <Trash2 size={14} /> Keluarkan
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
      
      {/* MODALS */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        unassignedStudents={unassignedStudents}
        kelasId={kelasData.id}
        kelasNama={kelasData.nama}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        isLoading={isUnassigning}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleUnassign}
        title="Keluarkan Siswa?"
        message={`Apakah Anda yakin ingin mengeluarkan ${studentToUnassign?.nama} dari kelas ${kelasData.nama}? Siswa ini akan kembali ke daftar siswa tanpa kelas.`}
        confirmText="Ya, Keluarkan"
      />

      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
