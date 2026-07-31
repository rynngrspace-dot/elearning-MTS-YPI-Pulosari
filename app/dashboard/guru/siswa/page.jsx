"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Loader2, 
  ChevronRight,
  UserCheck,
  Eye
} from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getTeacherStudentsAction } from "@/lib/actions/pengampu-actions";

export default function TeacherStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (user?.teacherId) {
      const fetchData = async () => {
        const res = await getTeacherStudentsAction(user.teacherId);
        if (res.success) setStudents(res.data);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const classes = ["Semua", ...new Set(students.map(s => s.kelas))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || 
                          s.nisn.includes(search);
    const matchesKelas = selectedKelas === "Semua" || s.kelas === selectedKelas;
    return matchesSearch && matchesKelas;
  });

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 size={40} className="animate-spin text-indigo" />
        <p className="text-zinc-500 font-medium animate-pulse">Menyiapkan daftar siswa...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo/10 text-indigo rounded-lg">
              <Users size={20} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 font-jakarta">Daftar Siswa</h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Melihat seluruh siswa dari kelas yang Anda ampu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center gap-2">
            <UserCheck size={16} className="text-green-500" />
            <span className="text-sm font-bold text-zinc-700">{students.length} Total Siswa</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau NISN siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter size={16} className="text-zinc-400" />
          <select 
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="flex-1 bg-zinc-50/50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Student Table */}
      {filteredStudents.length > 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm shadow-indigo/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider w-16">No</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">NISN</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">Kelas</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">Gender</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Kontak Orang Tua</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredStudents.map((student, idx) => (
                  <tr 
                    key={student.id}
                    className="group hover:bg-cream/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-zinc-400 font-medium">
                      {(idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-indigo group-hover:text-white transition-all transform group-hover:scale-105 duration-300">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo transition-colors">{student.nama}</p>
                          <p className="text-[11px] text-zinc-400">{student.username}@elearning.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 font-mono">
                      {student.nisn}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[11px] font-bold group-hover:bg-indigo/10 group-hover:text-indigo transition-colors">
                        {student.kelas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-zinc-600">
                      {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Phone size={14} className="group-hover:text-green-500 transition-colors" />
                        <span className="text-xs">{student.noHpOrangTua || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                       <div className="relative inline-block group/tooltip">
                         <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-indigo hover:bg-indigo/10 rounded-lg transition-all cursor-pointer"
                          title="Lihat Profil"
                        >
                          <Eye size={18} />
                        </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                            Lihat Detail
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                          </div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Tidak ada siswa ditemukan</h3>
          <p className="text-zinc-500 text-sm max-w-xs">
            Coba sesuaikan kata kunci pencarian atau filter kelas Anda.
          </p>
        </div>
      )}
      {selectedStudent && (
  
  
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-[slideUp_.2s_ease]">

      {/* Header */}
      <div className="bg-[#00a651] p-8 text-white">
        <div className="flex justify-between items-start">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap size={36} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {selectedStudent.nama}
              </h2>

              <p className="text-indigo-100 mt-1">
                NISN {selectedStudent.nisn}
              </p>

              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/20 text-sm">
                {selectedStudent.kelas}
              </span>

            </div>

          </div>

          <button
            onClick={() => setSelectedStudent(null)}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            ✕
          </button>

        </div>
      </div>

      {/* Content */}

      <div className="p-8 grid md:grid-cols-2 gap-6">

        <div className="space-y-5">

          <div>
            <p className="text-xs font-bold uppercase text-zinc-400">
              Username
            </p>

            <p className="font-semibold">
              {selectedStudent.username}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-zinc-400">
              Email
            </p>

            <div className="flex items-center gap-2">
              <Mail size={16}/>
              <span>{selectedStudent.username}@elearning.com</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-zinc-400">
              Gender
            </p>

            <p>
              {selectedStudent.gender === "L"
                ? "Laki-laki"
                : "Perempuan"}
            </p>
          </div>

        </div>

        <div className="space-y-5">

          <div>
            <p className="text-xs font-bold uppercase text-zinc-400">
              Nomor Orang Tua
            </p>

            <div className="flex items-center gap-2">
              <Phone size={16}/>
              <span>
                {selectedStudent.noHpOrangTua || "-"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-zinc-400">
              Alamat
            </p>

            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5"/>
              <span>
                {selectedStudent.alamat || "-"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-zinc-400">
              Status
            </p>

            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              Aktif
            </span>
          </div>

        </div>

      </div>

      <div className="border-t px-8 py-5 flex justify-end">
        <button
          onClick={() => setSelectedStudent(null)}
          className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-semibold"
        >
          Tutup
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}
