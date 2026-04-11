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
  UserCheck
} from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";
import { getTeacherStudentsAction } from "@/lib/actions/pengampu-actions";

export default function TeacherStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua");

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

      {/* Student Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div 
              key={student.id}
              className="group bg-white rounded-2xl border border-zinc-200 p-5 hover:border-indigo hover:shadow-lg hover:shadow-indigo/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-indigo group-hover:text-white transition-colors">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 group-hover:text-indigo transition-colors line-clamp-1">
                      {student.nama}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase">
                      NISN: {student.nisn}
                    </p>
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[10px] font-bold group-hover:bg-indigo/10 group-hover:text-indigo transition-colors">
                  {student.kelas}
                </div>
              </div>

              <div className="space-y-2.5 border-t border-zinc-100 pt-4">
                <div className="flex items-center gap-3 text-zinc-500">
                  <Mail size={14} className="shrink-0" />
                  <span className="text-xs truncate">{student.username}@elearning.com</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                  <MapPin size={14} className="shrink-0" />
                  <span className="text-xs line-clamp-1">{student.alamat || "Alamat belum diatur"}</span>
                </div>
                {student.noHpOrangTua && (
                  <div className="flex items-center gap-3 text-zinc-500">
                    <Phone size={14} className="shrink-0" />
                    <span className="text-xs">{student.noHpOrangTua}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-50 flex justify-end">
                 <button className="text-[11px] font-bold text-indigo flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 cursor-pointer">
                   LIHAT DETAIL <ChevronRight size={14} />
                 </button>
              </div>
            </div>
          ))}
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
    </div>
  );
}
