"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Video, Users, ArrowLeft, Power, Shield, RefreshCw } from "lucide-react";
import { endMeetingAction, getMeetAttendanceListAction } from "@/lib/actions/meet-actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TeacherRoomClient({ meeting, userName }) {
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [ending, setEnding] = useState(false);

  const fetchAttendance = async () => {
    setRefreshing(true);
    const res = await getMeetAttendanceListAction(meeting.id);
    if (res.success) {
      setAttendance(res.data);
    }
    setRefreshing(false);
  };

  // Poll attendance list every 10 seconds
  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleEndMeeting = async () => {
    if (!confirm("Apakah Anda yakin ingin mengakhiri pertemuan virtual ini? Semua siswa otomatis akan keluar.")) {
      return;
    }
    setEnding(true);
    const res = await endMeetingAction(meeting.id);
    if (res.success) {
      toast({
        title: "Pertemuan Berakhir",
        description: "Room kelas virtual berhasil dinonaktifkan.",
      });
      router.push("/dashboard/guru/meet");
    } else {
      toast({
        title: "Gagal",
        description: res.error,
        variant: "destructive",
      });
      setEnding(false);
    }
  };

  const activeCount = attendance.filter((a) => a.status === "Active").length;
  const idleCount = attendance.filter((a) => a.status === "Idle").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col xl:flex-row gap-6 p-6 overflow-hidden bg-zinc-50">
        {/* CONTROL PANEL DASHBOARD */}
        <div className="flex-1 flex flex-col bg-white border border-border rounded-3xl overflow-hidden shadow-sm relative p-8">
          
          {/* HEADER */}
          <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/guru/meet")}
                className="w-10 h-10 rounded-xl hover:bg-zinc-50 flex items-center justify-center text-ink-2 border border-transparent hover:border-border transition cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <span className="px-2 py-0.5 bg-indigo-light text-indigo text-[9px] font-black uppercase tracking-widest rounded-md">
                  LIVE CLASSROOM PANEL
                </span>
                <h2 className="text-lg font-black text-ink uppercase tracking-tight mt-0.5">
                  {meeting.pengampu.mapel.nama}
                </h2>
                <p className="text-xs text-ink-3 font-semibold uppercase tracking-wider">
                  Kelas {meeting.pengampu.kelas.nama}
                </p>
              </div>
            </div>
            
            <button
              disabled={ending}
              onClick={handleEndMeeting}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <Power size={14} /> Akhiri Pertemuan
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8">
            {/* Info Icon */}
            <div className="w-20 h-20 rounded-[24px] bg-indigo-light text-indigo flex items-center justify-center mb-6 shadow-md shadow-indigo/5">
              <Video size={40} />
            </div>

            <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">
              KONTROL PANEL GURU
            </span>
            
            <h1 className="text-2xl font-bold text-ink uppercase tracking-tight mb-2">
              Mulai Tatap Muka Virtual
            </h1>
            <p className="text-sm text-ink-3 font-semibold mb-8">
              Klik tombol di bawah ini untuk membuka dan memoderasi ruang kelas Jitsi Meet di Tab Baru.
            </p>

            {/* Instruction Warning Banner */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left mb-8 flex items-start gap-4">
              <span className="text-2xl mt-0.5">💡</span>
              <div>
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-tight mb-1">
                  Tips Moderasi:
                </h4>
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  Biarkan tab E-learning ini tetap terbuka di latar belakang atau di samping layar Anda. Halaman ini akan secara otomatis memperbarui **Absensi Real-Time** siswa setiap 10 detik, sehingga Anda dapat memantau siapa saja siswa yang aktif atau sedang pasif (idle).
                </p>
              </div>
            </div>

            {/* Action Button */}
            <a
              href={`https://meet.jit.si/${meeting.roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${encodeURIComponent(userName || "Guru")}"`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-indigo hover:bg-indigo-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo/10 transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              <Video size={16} /> Buka Ruang Tatap Muka (Tab Baru)
            </a>
          </div>
        </div>

        {/* ATTENDANCE SIDE PANEL */}
        <div className="w-full xl:w-[350px] bg-white border border-border rounded-3xl flex flex-col overflow-hidden shadow-sm shrink-0">
          <div className="p-6 border-b border-border bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo" />
                <h3 className="text-sm font-black text-ink uppercase tracking-wider">
                  Absensi Real-Time
                </h3>
              </div>
              <button
                onClick={fetchAttendance}
                disabled={refreshing}
                className="w-8 h-8 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-border flex items-center justify-center text-ink-3 transition cursor-pointer"
              >
                <RefreshCw size={14} className={cn(refreshing && "animate-spin")} />
              </button>
            </div>

            {/* Attendance Status Counter */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-1">
                  Aktif
                </p>
                <p className="text-xl font-bold text-green-700">{activeCount}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Pasif
                </p>
                <p className="text-xl font-bold text-amber-700">{idleCount}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider mb-1">
                  Absen
                </p>
                <p className="text-xl font-bold text-red-700">{absentCount}</p>
              </div>
            </div>
          </div>

          {/* STUDENT LIST */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3.5 bg-zinc-50/50">
            {attendance.length > 0 ? (
              attendance.map((student) => (
                <div
                  key={student.studentId}
                  className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold text-ink uppercase tracking-tight truncate">
                      {student.name}
                    </h4>
                    <p className="text-[9px] text-ink-3 font-semibold uppercase tracking-widest mt-0.5">
                      NISN: {student.nisn}
                    </p>
                    {student.lastSeen && (
                      <p className="text-[8px] text-indigo font-bold uppercase tracking-wider mt-1 opacity-80">
                        Aktif: {student.duration} Menit
                      </p>
                    )}
                  </div>

                  {student.status === "Active" ? (
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-[8px] font-black uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      Aktif
                    </span>
                  ) : student.status === "Idle" ? (
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-black uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-amber-500" />
                      Pasif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[8px] font-black uppercase tracking-wider">
                      Absen
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Users size={32} className="text-zinc-200 mx-auto mb-2" />
                <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest">
                  Tidak ada siswa terdaftar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
