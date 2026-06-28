"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Video, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { pingMeetAttendanceAction, getMeetingByIdAction, leaveMeetAttendanceAction, markMeetAttendancePasifAction } from "@/lib/actions/meet-actions";
import { toast } from "@/hooks/use-toast";

export default function StudentRoomClient({ meeting, studentId, userName }) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  // Anti-cheat verification states
  const [isIdle, setIsIdle] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Synthesize beep sound via Web Audio API
  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.3); // 300ms beep
    } catch (e) {
      console.warn("AudioContext not allowed or failed", e);
    }
  };

  // 1. Heartbeat Ping every 30 seconds (skipped when student is Idle)
  useEffect(() => {
    const sendPing = async () => {
      if (isIdle) return;
      await pingMeetAttendanceAction(meeting.id, studentId);
    };

    // Initial ping
    sendPing();

    const interval = setInterval(sendPing, 30000);
    return () => clearInterval(interval);
  }, [meeting.id, studentId, isIdle]);

  // 2. Schedule presence checks randomly
  useEffect(() => {
    // If local dev environment, trigger every 1-2 mins. Otherwise, trigger every 5-10 mins.
    const isDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const minTime = isDev ? 60000 : 300000;  // 1 min vs 5 mins
    const maxTime = isDev ? 120000 : 600000; // 2 mins vs 10 mins

    const getRandomDelay = () => Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

    let timer;
    const schedule = () => {
      const delay = getRandomDelay();
      timer = setTimeout(() => {
        setShowCheckIn(true);
        setCountdown(60);
        playAlertSound();
      }, delay);
    };

    if (!isIdle && !showCheckIn) {
      schedule();
    }

    return () => clearTimeout(timer);
  }, [isIdle, showCheckIn]);

  // 2.5. Send Pasif status to database when student becomes Idle
  useEffect(() => {
    if (isIdle) {
      markMeetAttendancePasifAction(meeting.id, studentId);
    }
  }, [isIdle, meeting.id, studentId]);

  // 3. Countdown timer for check-in
  useEffect(() => {
    if (!showCheckIn || isIdle) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsIdle(true);
          return 0;
        }
        // Beep soft sound alert when timer is low (under 10s) or every 10s
        if (prev <= 10 || prev % 10 === 0) {
          playAlertSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCheckIn, isIdle]);

  // 4. Poll meeting status every 10 seconds to detect if Teacher ended it
  useEffect(() => {
    const checkMeetingStatus = async () => {
      setChecking(true);
      const res = await getMeetingByIdAction(meeting.id);
      if (res.success && res.data) {
        if (res.data.status !== "ACTIVE") {
          toast({
            title: "Pertemuan Berakhir",
            description: "Guru telah mengakhiri kelas tatap muka virtual ini.",
          });
          router.push("/dashboard/siswa/meet");
        }
      } else {
        // If error fetching or not found, fall back
        router.push("/dashboard/siswa/meet");
      }
      setChecking(false);
    };

    const interval = setInterval(checkMeetingStatus, 10000);
    return () => clearInterval(interval);
  }, [meeting.id, router]);



  const handleLeaveRoom = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari kelas tatap muka virtual ini?")) {
      await leaveMeetAttendanceAction(meeting.id, studentId);
      router.push("/dashboard/siswa/meet");
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col p-6 bg-zinc-50 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white border border-border rounded-3xl overflow-hidden shadow-sm relative">
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLeaveRoom}
                className="w-10 h-10 rounded-xl hover:bg-zinc-50 flex items-center justify-center text-ink-2 border border-transparent hover:border-border transition cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 text-[9px] font-black uppercase tracking-widest rounded-md">
                  VIRTUAL CLASSROOM
                </span>
                <h2 className="text-sm font-bold text-ink uppercase tracking-tight">
                  {meeting.pengampu.mapel.nama} - Bersama {meeting.pengampu.teacher.user.name}
                </h2>
              </div>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-ink-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer border border-border"
            >
              <LogOut size={14} /> Keluar Kelas
            </button>
          </div>

          {/* CONTROL PANEL DASHBOARD */}
          <div className="flex-1 w-full bg-zinc-50 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
            <div className="w-full max-w-2xl bg-white border border-border rounded-[32px] p-10 shadow-sm flex flex-col items-center text-center">
              
              {/* Class Info Icon */}
              <div className="w-20 h-20 rounded-[24px] bg-indigo-light text-indigo flex items-center justify-center mb-6 shadow-md shadow-indigo/5">
                <Video size={40} />
              </div>

              <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">
                TATAP MUKA AKTIF
              </span>
              
              <h1 className="text-2xl font-bold text-ink uppercase tracking-tight mb-2">
                {meeting.pengampu.mapel.nama}
              </h1>
              <p className="text-sm text-ink-3 font-semibold mb-8">
                Kelas {meeting.pengampu.kelas.nama} • Bersama {meeting.pengampu.teacher.user.name}
              </p>

              {/* Status Indicators */}
              <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-50 border border-border rounded-2xl p-5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-ink-3 uppercase tracking-wider mb-1">Status Absensi</span>
                  {isIdle ? (
                    <span className="text-sm font-black text-red-600 uppercase tracking-tight flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> PASIF (IDLE)
                    </span>
                  ) : (
                    <span className="text-sm font-black text-green-600 uppercase tracking-tight flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" /> AKTIF
                    </span>
                  )}
                </div>
                
                <div className="bg-zinc-50 border border-border rounded-2xl p-5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-ink-3 uppercase tracking-wider mb-1">Sistem Deteksi</span>
                  <span className="text-sm font-black text-indigo uppercase tracking-tight">
                    Pop-up Acak Aktif
                  </span>
                </div>
              </div>

              {/* Important Instruction Alert */}
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left mb-8 flex items-start gap-4">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div>
                  <h4 className="text-xs font-black text-amber-800 uppercase tracking-tight mb-1">
                    Penting untuk Absensi:
                  </h4>
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    Klik tombol di bawah untuk masuk ke ruang video conference Jitsi di Tab Baru. **Harap jangan menutup halaman E-learning ini** agar sistem absensi otomatis tetap mencatat waktu belajar Anda di latar belakang.
                  </p>
                </div>
              </div>

              {/* Join Button */}
              <a
                href={`https://meet.jit.si/${meeting.roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${encodeURIComponent(userName || "Siswa")}"`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-indigo hover:bg-indigo-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo/10 transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <Video size={16} /> Gabung Kelas Tatap Muka (Tab Baru)
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* ANTI-CHEAT CHECK-IN MODAL OVERLAY */}
      {showCheckIn && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}} />

          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center animate-scaleIn">
            {isIdle ? (
              <>
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-6">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-black text-red-600 uppercase tracking-tight mb-2">
                  Status Anda: Pasif (Idle)
                </h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider leading-relaxed max-w-sm mb-8">
                  Anda terdeteksi tidak aktif karena tidak merespons pop-up kehadiran. Silakan klik tombol di bawah untuk kembali aktif.
                </p>
                <button
                  onClick={async () => {
                    setIsIdle(false);
                    setShowCheckIn(false);
                    // Send an immediate heartbeat ping to recover status
                    await pingMeetAttendanceAction(meeting.id, studentId);
                  }}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  Kembali Aktif
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6">
                  <span className="text-2xl animate-pulse">⏰</span>
                </div>
                <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight mb-2">
                  Konfirmasi Kehadiran
                </h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider leading-relaxed max-w-sm mb-6">
                  Apakah Anda masih mengikuti kelas virtual ini? Silakan klik konfirmasi sebelum batas waktu habis.
                </p>
                
                {/* Circular Timer Visual */}
                <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center mb-8 animate-pulse">
                  <span className="text-2xl font-black text-zinc-800">
                    {countdown}s
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowCheckIn(false);
                  }}
                  className="w-full py-4 bg-indigo hover:bg-indigo-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo/20 transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  Saya Masih Menyimak
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
