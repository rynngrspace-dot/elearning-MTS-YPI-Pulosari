"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { 
  createTahunAjaranAction, 
  activateTahunAjaranAction, 
  deleteTahunAjaranAction 
} from "@/lib/actions/tahun-ajaran-actions";

export default function TahunAjaranClient({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ tahun: "", semester: "Ganjil" });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleToggleActive = async (id) => {
    setIsLoading(true);
    try {
      const res = await activateTahunAjaranAction(id);
      if (res.success) {
        // Success handled by revalidation
      } else {
        alert("Gagal mengubah status: " + res.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tahun ajaran ini?")) return;
    try {
      const res = await deleteTahunAjaranAction(id);
      if (res.success) {
        // Success handled by revalidation
      } else {
        alert("Gagal menghapus: " + res.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createTahunAjaranAction(formData);
      if (res.success) {
        setIsModalOpen(false);
        setFormData({ tahun: "", semester: "Ganjil" });
      } else {
        alert("Gagal menambah tahun ajaran: " + res.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Tahun Ajaran</h1>
          <p className="text-slate-500">Kelola periode akademik aktif untuk seluruh sistem.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo hover:bg-indigo-hover text-white px-5 py-2.5 rounded-2xl transition-all"
        >
          <Plus size={20} />
          Tambah Tahun Ajaran
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200 text-slate-600 font-semibold text-sm">
              <th className="px-6 py-4">Tahun Ajaran</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4 text-center">Status Aktif</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                  Belum ada data tahun ajaran.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-700">{item.tahun}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      item.semester === 'Ganjil' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.semester}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleToggleActive(item.id)}
                        disabled={isLoading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          item.isActive ? "bg-green-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isLoading || item.isActive}
                      className={`text-slate-400 hover:text-red-600 transition-colors ${
                        item.isActive ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title={item.isActive ? "Tidak dapat menghapus tahun ajaran aktif" : "Hapus"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Tambah Tahun Ajaran</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: 2023/2024"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={formData.tahun}
                  onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-indigo text-white rounded-2xl hover:bg-indigo-hover transition-all font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm animate-bounce">
          <Loader2 className="animate-spin" size={16} />
          Memproses data...
        </div>
      )}
    </div>
  );
}
