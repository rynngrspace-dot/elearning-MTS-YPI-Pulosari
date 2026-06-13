"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi Hapus", 
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  isLoading = false,
  confirmText = "Hapus Data",
  variant = "destructive"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-6 sm:p-10">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-surface w-full max-w-md rounded-[40px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
        <div className="p-8 pb-4 flex justify-between items-start">
           <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-inner">
              <AlertTriangle size={28} strokeWidth={2.5} />
           </div>
           <button 
             onClick={onClose} 
             disabled={isLoading}
             className="p-2 hover:bg-cream rounded-xl transition-colors text-ink-3"
           >
             <X size={20} />
           </button>
        </div>

        <div className="px-8 pt-2 pb-8 flex flex-col gap-3">
           <h2 className="text-xl font-black text-ink uppercase tracking-tight leading-none">{title}</h2>
           <p className="text-[13px] font-bold text-ink-3 leading-relaxed">
             {message}
           </p>
        </div>

        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-3 mt-2">
           <button 
             onClick={onClose}
             disabled={isLoading}
             className="flex-1 py-4 px-6 bg-surface border border-border rounded-2xl text-[11px] font-black text-ink-2 hover:bg-cream transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
           >
             Batalkan
           </button>
           <button 
             onClick={onConfirm}
             disabled={isLoading}
             className={`flex-1 py-4 px-6 ${variant === 'destructive' ? 'bg-red-500' : 'bg-indigo'} text-white rounded-2xl text-[11px] font-black hover:opacity-90 transition-all uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50`}
           >
             {isLoading ? <Loader2 size={16} className="animate-spin" /> : confirmText}
           </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
