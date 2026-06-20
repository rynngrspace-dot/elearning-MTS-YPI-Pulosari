"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Shield,
  Loader2,
  KeyRound,
  User,
  Mail,
  UserCheck
} from "lucide-react";
import {
  createAdminAction,
  updateAdminAction,
  deleteAdminAction
} from "@/lib/actions/admin-actions";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function AdminClient({ initialAdmins, currentAdminId }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // Search filter
  const filteredAdmins = admins.filter((admin) => {
    const name = admin.name?.toLowerCase() || "";
    const username = admin.username?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || username.includes(search);
  });

  const openModal = (admin = null) => {
    setEditingAdmin(admin);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setFormErrors({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSaving(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    let errors = {};
    if (!data.name) errors.name = "Nama lengkap wajib diisi";
    if (!data.username) errors.username = "Username/Email wajib diisi";
    if (!editingAdmin && !data.password) {
      errors.password = "Password wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSaving(false);
      return;
    }

    try {
      const res = editingAdmin
        ? await updateAdminAction(editingAdmin.id, data)
        : await createAdminAction(data);

      if (res.success) {
        toast({
          title: editingAdmin ? "Admin Diperbarui" : "Admin Ditambahkan",
          description: `Data admin ${data.name} berhasil disimpan.`,
          variant: "success",
        });

        // Update state
        if (editingAdmin) {
          setAdmins((prev) =>
            prev.map((item) => (item.id === editingAdmin.id ? { ...item, ...res.data } : item))
          );
        } else {
          setAdmins((prev) => [res.data, ...prev]);
        }

        closeModal();
        router.refresh();
      } else {
        toast({
          title: "Gagal Menyimpan",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan Sistem",
        description: "Terjadi kesalahan yang tidak terduga.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirm = (id) => {
    if (id === currentAdminId) {
      return toast({
        title: "Peringatan Keamanan",
        description: "Anda tidak dapat menghapus akun Anda sendiri.",
        variant: "destructive",
      });
    }
    setAdminToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteAdminAction(adminToDelete, currentAdminId);
      if (res.success) {
        toast({
          title: "Admin Dihapus",
          description: "Akun admin berhasil dihapus dari sistem.",
          variant: "success",
        });
        setAdmins((prev) => prev.filter((item) => item.id !== adminToDelete));
        setIsConfirmOpen(false);
        setAdminToDelete(null);
        router.refresh();
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat menghapus data.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-8 animate-[slideUp_.3s_ease]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo flex items-center justify-center text-white shadow-lg border border-indigo-border">
            <Shield size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-light text-indigo text-[10px] font-black uppercase tracking-widest rounded">
                Hak Akses Utama
              </span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="text-[10px] text-ink-3 font-bold uppercase tracking-widest leading-none">
                Data Pengguna
              </p>
            </div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">KELOLA ADMINISTRATOR</h1>
          </div>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo text-white rounded-2xl text-[11px] font-black hover:bg-indigo-hover transition-all shadow-xl shadow-indigo/20 uppercase tracking-widest border border-white/10"
        >
          <Plus size={16} /> Tambah Admin
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3" size={18} />
          <input
            type="text"
            placeholder="CARI NAMA / USERNAME ADMIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-xs font-black placeholder:text-ink-3/50 outline-none focus:border-indigo/50 transition-all uppercase tracking-wider"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-surface border border-border rounded-[20px] overflow-hidden shadow-card p-2 flex flex-col gap-2">
        <div className="overflow-x-auto rounded-[16px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cream/40">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Nama Lengkap</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3">Username / Email</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-cream/20 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-light flex items-center justify-center text-indigo font-bold">
                          {admin.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-[13px] font-black text-ink uppercase tracking-tight flex items-center gap-1.5">
                            {admin.name}
                            {admin.id === currentAdminId && (
                              <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[8px] font-black uppercase tracking-wider rounded border border-green-200">
                                Sesi Anda
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[12px] font-medium text-ink-2">{admin.username}</span>
                    </td>
                    <td className="px-7 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(admin)}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-2xl text-ink-3 hover:text-indigo hover:border-indigo/20 transition-all cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          disabled={admin.id === currentAdminId}
                          onClick={() => openDeleteConfirm(admin.id)}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center bg-white border border-border rounded-2xl text-ink-3 transition-all cursor-pointer",
                            admin.id === currentAdminId
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:text-red-500 hover:border-red-100"
                          )}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-ink-3 font-bold uppercase tracking-widest text-[11px]">
                    Tidak ada data admin ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={closeModal} />
          <div className="relative bg-surface w-full max-w-md rounded-[32px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-cream/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink uppercase tracking-tight">
                    {editingAdmin ? "Ubah Akun Admin" : "Tambah Admin Baru"}
                  </h3>
                  <p className="text-[9px] font-bold text-ink-3 uppercase tracking-widest">
                    Hak Akses Administrator
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center border border-border rounded-xl text-ink-3 hover:bg-cream transition active:scale-90"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest flex items-center gap-1.5">
                  <User size={12} /> Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingAdmin?.name}
                  placeholder="MASUKKAN NAMA LENGKAP ADMIN"
                  className={cn(
                    "px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black uppercase outline-none",
                    formErrors.name ? "border-red-500 bg-red-50/10" : "border-border"
                  )}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest flex items-center gap-1.5">
                  <Mail size={12} /> Username / Email
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingAdmin?.username}
                  placeholder="admin@sekolah.id atau admin123"
                  className={cn(
                    "px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black outline-none",
                    formErrors.username ? "border-red-500 bg-red-50/10" : "border-border"
                  )}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest flex items-center gap-1.5">
                  <KeyRound size={12} /> Password Akun
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder={
                    editingAdmin ? "KOSONGKAN JIKA TIDAK INGIN DIUBAH" : "BUAT PASSWORD AKUN ADMIN"
                  }
                  className={cn(
                    "px-6 py-4.5 bg-cream/30 border rounded-2xl text-[13px] font-black outline-none",
                    formErrors.password ? "border-red-500 bg-red-50/10" : "border-border"
                  )}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4.5 border border-border rounded-2xl text-[11px] font-black text-ink-3 hover:bg-cream transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4.5 bg-indigo text-white rounded-2xl text-[11px] font-black hover:bg-indigo-hover transition-all uppercase tracking-widest border border-white/10 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {editingAdmin ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Akun Admin?"
        message="Akun administrator ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus Admin"
        cancelText="Batal"
        loading={isDeleting}
      />
    </div>
  );
}
