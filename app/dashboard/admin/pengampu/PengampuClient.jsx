"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { createPengampuAction, updatePengampuBulkAction, deletePengampuAction, bulkDeletePengampuAction } from "@/lib/actions/pengampu-actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Briefcase,
  User,
  BookMarked,
  CalendarClock,
  X,
  ChevronRight,
  Info
} from "lucide-react";

export default function PengampuClient({ initialData, teachers, mapels, kelas, academics }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [formErrors, setFormErrors] = useState({});

  const [selectedPengampuIds, setSelectedPengampuIds] = useState([]);

  const toggleSelectPengampu = (id) => {
    setSelectedPengampuIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPengampuIds.length === filteredData.length) {
      setSelectedPengampuIds([]);
    } else {
      setSelectedPengampuIds(filteredData.map(a => a.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPengampuIds.length === 0) return;

    if (!confirm(`Hapus ${selectedPengampuIds.length} penugasan terpilih secara permanen?`)) return;

    setIsDeleting(true);
    try {
      const res = await bulkDeletePengampuAction(selectedPengampuIds);
      if (res.success) {
        toast({
          title: "Berhasil!",
          description: `${selectedPengampuIds.length} data penugasan telah dihapus.`,
          variant: "success",
        });
        setSelectedPengampuIds([]);
      } else {
        toast({
          title: "Gagal Menghapus",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ title: "Kesalahan", description: "Terjadi kesalahan saat menghapus data massal.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Deletion State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  // Search/Filter logic for the table
  const filteredData = useMemo(() => {
    return data.filter(a =>
      a.teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mapel.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.kelas.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Group by Teacher for Table display
  const groupedData = useMemo(() => {
    const groups = filteredData.reduce((acc, current) => {
      const tId = current.teacherId;
      if (!acc[tId]) {
        acc[tId] = {
          teacher: current.teacher,
          assignments: []
        };
      }
      acc[tId].assignments.push(current);
      return acc;
    }, {});

    return Object.values(groups).sort((a, b) =>
      a.teacher.user.name.localeCompare(b.teacher.user.name)
    );
  }, [filteredData]);

  // Bulk Modal State for Editing
  const [modalAssignments, setModalAssignments] = useState([]);

  // Sync selectedTeacherId and modalAssignments
  useEffect(() => {
    if (isModalOpen) {
      if (editingAssignment) {
        setSelectedTeacherId(editingAssignment.teacherId);
        // Find ALL assignments for this specific teacher
        const teacherAssignments = data.filter(a => a.teacherId === editingAssignment.teacherId);
        setModalAssignments(teacherAssignments.map(a => ({
          id: a.id,
          mapelId: a.mapelId,
          kelasId: a.kelasId,
          hari: a.hari || "",
          jamMulai: a.jamMulai || "",
          jamSelesai: a.jamSelesai || ""
        })));
      } else {
        setSelectedTeacherId("");
        setModalAssignments([]);
      }
    }
  }, [isModalOpen, editingAssignment, data]);

  const updateModalRow = (id, field, value) => {
    setModalAssignments(modalAssignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSaving(true);

    try {
      if (editingAssignment) {
        // Mode Edit: Bulk Update for the teacher
        const res = await updatePengampuBulkAction(modalAssignments);
        if (res.success) {
          toast({ title: "Penugasan Berhasil Diperbarui", variant: "success" });
          setIsModalOpen(false);
          setEditingAssignment(null);
        } else {
          toast({ title: "Gagal Menyimpan", description: res.error, variant: "destructive" });
        }
      } else {
        // Mode Tambah: Standard Single Creation
        const formData = new FormData(e.target);
        const body = Object.fromEntries(formData.entries());

        let errors = {};
        if (!body.teacherId) errors.teacherId = "Mohon pilih guru";
        if (!body.mapelId) errors.mapelId = "Mohon pilih mata pelajaran";
        if (!body.kelasId) errors.kelasId = "Mohon pilih kelas";

        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          setIsSaving(false);
          return;
        }

        const payload = {
          ...body,
          hari: body.hari || null,
          jamMulai: body.jamMulai || null,
          jamSelesai: body.jamSelesai || null,
        };

        const res = await createPengampuAction(payload);
        if (res.success) {
          toast({ title: "Penugasan Berhasil Dibuat", variant: "success" });
          setIsModalOpen(false);
        } else {
          toast({ title: "Gagal Menyimpan", description: res.error, variant: "destructive" });
        }
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Kesalahan Koneksi", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assignmentToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deletePengampuAction(assignmentToDelete);
      if (res.success) {
        toast({
          title: "Penugasan Dihapus",
          description: "Data telah berhasil dihapus.",
          variant: "success",
        });
        setIsConfirmOpen(false);

        // If we were in the modal, remove it from the list
        setModalAssignments(prev => prev.filter(a => a.id !== assignmentToDelete));

        // If no more assignments for this teacher in the modal, close it
        if (editingAssignment && modalAssignments.length <= 1) {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }
      } else {
        toast({ title: "Gagal Menghapus", description: res.error, variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Kesalahan Koneksi", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setAssignmentToDelete(null);
    }
  };

  const openDeleteConfirm = (id) => {
    setAssignmentToDelete(id);
    setIsConfirmOpen(true);
  };

  const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  return (
    <>
      <div className="p-6 md:p-12 flex flex-col gap-10 animate-slideUp">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo border border-indigo-border flex items-center justify-center text-white">
                <Briefcase size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-ink tracking-tight uppercase leading-none">Penugasan Pengampu</h1>
                <div className="text-[11px] text-ink-3 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                  <div className="w-2 h-0.5 bg-indigo/40" /> Manajemen Penjadwalan Guru
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-indigo to-indigo-hover text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10 cursor-pointer group"
              >
                <Plus className="group-hover:rotate-90 transition-transform" size={18} strokeWidth={3} /> Tambah Penugasan
              </button>
            </div>
          </div>

          <div className="relative group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-3 group-focus-within:text-indigo transition-colors" />
            <input
              type="text"
              placeholder="CARI GURU, MAPEL, ATAU KELAS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-7 py-4 bg-surface border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[40px] overflow-hidden shadow-card p-2">
          <div className="overflow-x-auto rounded-[32px]">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-cream/40">
                <tr>
                  <th className="px-8 py-5 w-[10px]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                      checked={selectedPengampuIds.length === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 whitespace-nowrap">Guru Pengampu</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 whitespace-nowrap">Mata Pelajaran</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 whitespace-nowrap">Unit Kelas</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 whitespace-nowrap">Jadwal Harian</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-ink-3 text-center whitespace-nowrap">Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {groupedData.flatMap((group) => (
                  group.assignments.map((a, idx) => (
                    <tr key={a.id} className={cn(
                      "hover:bg-cream/5 transition-all group",
                      selectedPengampuIds.includes(a.id) ? "bg-indigo-50/30" : ""
                    )}>
                      <td className="px-8 py-5">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo transition-all cursor-pointer"
                          checked={selectedPengampuIds.includes(a.id)}
                          onChange={() => toggleSelectPengampu(a.id)}
                        />
                      </td>
                      {/* Teacher Column - Only on first row with rowSpan */}
                      {idx === 0 && (
                        <td
                          rowSpan={group.assignments.length}
                          className="px-8 py-6 align-top w-[260px] border-r border-border/50 bg-indigo-50/[0.03]"
                        >
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-ink uppercase tracking-tight block leading-none">{group.teacher.user.name}</span>
                            <span className="text-[9px] font-bold text-ink-3 uppercase tracking-widest mt-2 block opacity-50">NIP. {group.teacher.nip || "---"}</span>
                          </div>
                        </td>
                      )}

                      {/* Mapel Column */}
                      <td className="px-8 py-4">
                        <span className="text-[13px] font-black text-ink uppercase tracking-tight">{a.mapel.nama}</span>
                      </td>

                      {/* Kelas Column */}
                      <td className="px-8 py-4 whitespace-nowrap">
                        <span className="inline-block whitespace-nowrap px-3 py-1 bg-indigo-50 text-indigo text-[10px] font-black rounded-lg border border-indigo-100 uppercase tracking-widest">{a.kelas.nama}</span>
                      </td>

                      {/* Jadwal Column */}
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo/5 flex items-center justify-center text-indigo shrink-0 group-hover:bg-indigo/10 transition-colors">
                            <CalendarClock size={14} />
                          </div>
                          {a.hari ? (
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-indigo uppercase tracking-widest leading-none">{a.hari}</span>
                              <span className="text-[10px] font-bold text-ink-3 tabular-nums mt-1">{a.jamMulai} - {a.jamSelesai}</span>
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold text-ink-3 uppercase tracking-widest opacity-30 italic">Belum Diatur</span>
                          )}
                        </div>
                      </td>

                      {/* Action Column - Only on first row with rowSpan */}
                      {idx === 0 && (
                        <td rowSpan={group.assignments.length} className="px-8 py-6 w-[80px] border-l border-border/50 text-center">
                          <button
                            onClick={() => { setEditingAssignment(group.assignments[0]); setIsModalOpen(true); }}
                            className="w-10 h-10 flex items-center justify-center bg-indigo text-white rounded-2xl hover:bg-indigo-hover transition-all mx-auto"
                            title="Kelola Semua Penugasan Guru"
                          >
                            <Edit size={16} strokeWidth={3} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ))}
                {groupedData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-ink-3 font-bold uppercase tracking-[0.2em] opacity-40 italic">
                      Data penugasan tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR FOR BULK DELETE */}
      {selectedPengampuIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[101] animate-slideUp">
          <div className="flex items-center gap-8 px-10 py-5 bg-ink text-white rounded-[32px] border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col">
              <span className="text-[13px] font-black tracking-tight">{selectedPengampuIds.length} Penugasan Terpilih</span>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Aksi Massal Tersedia</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPengampuIds([])}
                className="px-6 py-2.5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="px-8 py-2.5 bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
              >
                {isDeleting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-fadeIn" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface w-full max-w-2xl rounded-[48px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-slideUp max-h-[90vh]">
            <div className="p-8 border-b border-border bg-indigo-50/30 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo border border-indigo/5">
                  <CalendarClock size={22} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-ink uppercase tracking-tight leading-none">
                    {editingAssignment ? "Atur Jadwal Mengajar" : "Tambah Penugasan Baru"}
                  </h2>
                  <p className="text-[10px] font-black text-ink-3 mt-2 uppercase tracking-widest opacity-60">
                    {editingAssignment ? editingAssignment.teacher.user.name : "Manajemen Pengampu"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border border-border rounded-full text-ink-3 hover:text-ink"><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col h-full overflow-hidden">
              <div className="p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                {editingAssignment ? (
                  /* MODE EDIT JADWAL: Tampilkan list mapel yang diampu */
                  <div className="flex flex-col gap-6">
                    {modalAssignments.map((a) => (
                      <div key={a.id} className="p-6 bg-cream/10 border border-border/60 rounded-[32px] relative group/item shadow-sm hover:border-indigo/30 transition-all">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo text-white flex items-center justify-center">
                              <BookMarked size={14} />
                            </div>
                            <h4 className="text-[12px] font-black text-ink uppercase tracking-tight">Edit Penugasan</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(a.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-60 hover:opacity-100"
                            title="Hapus Penugasan Ini"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-ink-3 uppercase ml-1 tracking-widest">Mata Pelajaran</label>
                            <select
                              value={a.mapelId}
                              onChange={(e) => updateModalRow(a.id, "mapelId", e.target.value)}
                              className="px-4 py-3 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            >
                              <option value="">PILIH MAPEL</option>
                              {mapels.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                            </select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-ink-3 uppercase ml-1 tracking-widest">Unit Kelas</label>
                            <select
                              value={a.kelasId}
                              onChange={(e) => updateModalRow(a.id, "kelasId", e.target.value)}
                              className="px-4 py-3 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            >
                              {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-ink-3 uppercase ml-1 tracking-widest">Hari</label>
                            <select
                              value={a.hari}
                              onChange={(e) => updateModalRow(a.id, "hari", e.target.value)}
                              className="px-4 py-3 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            >
                              <option value="">PILIH HARI</option>
                              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-ink-3 uppercase ml-1 tracking-widest">Mulai</label>
                            <input
                              type="time"
                              value={a.jamMulai}
                              onChange={(e) => updateModalRow(a.id, "jamMulai", e.target.value)}
                              className="px-4 py-3 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-ink-3 uppercase ml-1 tracking-widest">Selesai</label>
                            <input
                              type="time"
                              value={a.jamSelesai}
                              onChange={(e) => updateModalRow(a.id, "jamSelesai", e.target.value)}
                              className="px-4 py-3 bg-white border border-border rounded-2xl text-[10px] font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* MODE TAMBAH: Pilihan tunggal guru & mappel */
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Pilih Guru</label>
                      <select
                        value={selectedTeacherId}
                        name="teacherId"
                        onChange={(e) => {
                          const tId = e.target.value;
                          setSelectedTeacherId(tId);
                        }}
                        className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all", formErrors.teacherId ? "border-red-500 bg-red-50/10" : "border-border")}
                      >
                        <option value="">CARI NAMA GURU</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                      </select>
                      {formErrors.teacherId && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">{formErrors.teacherId}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Mata Pelajaran</label>
                        <select
                          name="mapelId"
                          className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all", formErrors.mapelId ? "border-red-500 bg-red-50/10" : "border-border")}
                        >
                          <option value="">PILIH MAPEL</option>
                          {mapels.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                        </select>
                        {formErrors.mapelId && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">{formErrors.mapelId}</p>}
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Unit Kelas</label>
                        <select name="kelasId" className={cn("px-6 py-4.5 bg-cream/30 border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all", formErrors.kelasId ? "border-red-500 bg-red-50/10" : "border-border")}>
                          <option value="">PILIH KELAS</option>
                          {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                        </select>
                        {formErrors.kelasId && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">{formErrors.kelasId}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Tahun Ajaran Aktif</label>
                      <select name="tahunAjaranId" className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
                        {academics.map(a => <option key={a.id} value={a.id}>{a.tahun} ({a.semester}) {a.isActive ? '- AKTIF' : ''}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Hari</label>
                        <select name="hari" className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
                          <option value="">PILIH HARI</option>
                          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Mulai</label>
                        <input name="jamMulai" type="time" className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-ink-3 uppercase ml-2 tracking-widest">Selesai</label>
                        <input name="jamSelesai" type="time" className="px-6 py-4.5 bg-cream/30 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-border bg-cream/5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-5 bg-indigo text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-indigo-hover transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isSaving ? "SEDANG MENYIMPAN..." : editingAssignment ? "Simpan Perubahan Jadwal" : "Publish Penugasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Penugasan?"
        message="Menghapus data ini akan memutus relasi antara guru dan kelas untuk mata pelajaran tersebut. Lanjutkan?"
        confirmText="Ya, Hapus Data"
      />
    </>
  );
}
