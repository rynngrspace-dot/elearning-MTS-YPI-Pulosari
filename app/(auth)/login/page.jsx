"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Lock,
  ArrowRight,
  Library,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
        setLoading(false);
      } else {
        // Redirection on successful login
        window.location.href = result.redirect;
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row items-center justify-center p-6 md:p-0 font-sans selection:bg-slate-100 selection:text-slate-900 overflow-x-hidden">
      {/* LEFT SECTION: CONTENT */}
      <div className="w-full md:w-1/2 max-w-lg mb-16 md:mb-0 md:pr-12 md:pl-24 animate-slideUp flex flex-col items-center md:items-start text-center md:text-left relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-800 rounded-full text-[9px] font-black uppercase tracking-[0.2em] animate-fadeIn">
            <CheckCircle2 size={12} /> Sistem E-Learning Resmi 2.0
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
            Log in <br />
            <span className="text-[#00A651] ">E-Learning</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg md:text-xl font-medium max-w-md leading-relaxed">
            Selamat Datang kembali, silahkan login ke akun Anda untuk
            melanjutkan akses pembelajaran.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: THE CARD */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:bg-slate-50/50 md:min-h-screen border-l border-slate-100 animate-fadeIn px-3 sm:px-6 relative z-20">
        <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-[28px] px-5 py-10 sm:p-10 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
          {/* Subtle Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50 group-hover:bg-slate-100 transition-colors duration-700" />

          <div className="relative z-10 space-y-8">
            {/* Branding Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center  transition-transform duration-500">
                <Image
                  src="/assets/images/logo-mts.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">
                  MTs YPI Pulosari
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">
                  Portal Akademik Terpadu
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-[11px] font-bold uppercase tracking-wider animate-fadeIn flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="group/input relative">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 group-focus-within/input:text-slate-900 transition-colors">
                    Username / NISN / NIP
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-slate-900 transition-colors"
                    />
                    <input
                      name="username"
                      type="text"
                      required
                      placeholder="Email / NISN"
                      className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] font-bold outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all placeholder:font-medium placeholder:opacity-30 disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="group/input relative">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-focus-within/input:text-slate-900 transition-colors">
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-[9px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-slate-900 transition-colors"
                    />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] font-bold outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all placeholder:font-medium placeholder:opacity-30 disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#00A651] hover:bg-[#008e45] disabled:bg-[#80d3a8] text-white rounded-xl text-[11px] font-medium uppercase tracking-[0.2em] shadow-xl shadow-[#00A651]/20 hover:shadow-[#00A651]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10 transition-transform group-hover/btn:translate-x-[-4px]">
                        Masuk ke Akun
                      </span>
                      <ArrowRight
                        size={16}
                        className="relative z-10 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all"
                      />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Belum punya akun?{" "}
                <Link
                  href="#"
                  className="text-slate-600 hover:text-slate-900 underline decoration-2 underline-offset-4"
                >
                  Hubungi Admin
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}
