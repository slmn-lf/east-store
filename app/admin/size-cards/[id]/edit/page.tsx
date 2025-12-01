"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { logout } from "@/app/auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface SizeCardRow {
  id?: number;
  size: string;
  panjang: number;
  lebarDada: number;
  lebarBahu: number;
  panjangLengan: number;
}

interface SizeCardTemplate {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  rows: SizeCardRow[];
}

const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

export default function EditSizeCardPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [sizeCard, setSizeCard] = useState<SizeCardTemplate | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [rows, setRows] = useState<SizeCardRow[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (templateId) {
      fetchSizeCard();
    }
  }, [templateId]);

  const fetchSizeCard = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/size-cards/${templateId}`);
      if (!response.ok) throw new Error("Failed to fetch size card");
      const data: SizeCardTemplate = await response.json();
      setSizeCard(data);
      setFormData({
        name: data.name,
        description: data.description || "",
      });
      setRows(
        data.rows.map((row) => ({
          ...row,
        }))
      );
    } catch (error) {
      console.error("Error fetching size card:", error);
      alert("Failed to load size card template");
      router.push("/admin/size-cards");
    } finally {
      setIsFetching(false);
    }
  }, [templateId, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama template harus diisi";
    }

    if (rows.length === 0) {
      newErrors.rows = "Minimal harus ada 1 ukuran";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRowChange = (
    index: number,
    field: keyof SizeCardRow,
    value: string | number
  ) => {
    const newRows = [...rows];
    if (field === "size") {
      newRows[index].size = value as string;
    } else {
      newRows[index] = {
        ...newRows[index],
        [field]: Number(value) || 0,
      };
    }
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        size: "",
        panjang: 0,
        lebarDada: 0,
        lebarBahu: 0,
        panjangLengan: 0,
      },
    ]);
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/size-cards/${templateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          rows: rows.map((row) => ({
            size: row.size,
            panjang: Number(row.panjang),
            lebarDada: Number(row.lebarDada),
            lebarBahu: Number(row.lebarBahu),
            panjangLengan: Number(row.panjangLengan),
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update size card");
      }

      alert("Size card template berhasil diperbarui");
      router.push("/admin/size-cards");
    } catch (error) {
      console.error("Error updating size card:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update size card"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800">
        <AdminMobileNav onLogout={handleLogout} title="EastStore" />
        <AdminSidebar isOpen={isSidebarOpen} onToggle={() => {}} />
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800">
      {/* Mobile Navigation */}
      <AdminMobileNav onLogout={handleLogout} title="EastStore" />

      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header */}
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        title="Edit Size Card"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6 max-w-4xl">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/size-cards"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="text-white" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Size Card</h1>
              <p className="text-white/60 mt-1">Update informasi size card</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Information */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Template Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., T-Shirt, Hoodie"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 transition-all ${
                      errors.name
                        ? "border-red-400/50 focus:border-red-400/70"
                        : "border-white/20 focus:border-white/40"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi template ukuran"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Size Rows */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Size Measurements
              </h2>

              {rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-3 text-white/70 font-medium">
                          Ukuran
                        </th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">
                          Panjang
                        </th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">
                          Lebar Dada
                        </th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">
                          Lebar Bahu
                        </th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">
                          Panjang Lengan
                        </th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/10 hover:bg-white/5"
                        >
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              value={row.size}
                              onChange={(e) =>
                                handleRowChange(index, "size", e.target.value)
                              }
                              placeholder="M, L, XL"
                              className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/10"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="0.1"
                              value={row.panjang}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "panjang",
                                  e.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/10"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="0.1"
                              value={row.lebarDada}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "lebarDada",
                                  e.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/10"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="0.1"
                              value={row.lebarBahu}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "lebarBahu",
                                  e.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/10"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="0.1"
                              value={row.panjangLengan}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "panjangLengan",
                                  e.target.value
                                )
                              }
                              placeholder="cm"
                              className="w-full px-2 py-1 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/10"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => deleteRow(index)}
                              className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded transition-all"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-white/60 text-center py-8">
                  Belum ada ukuran. Klik tombol di bawah untuk menambah.
                </p>
              )}

              <button
                type="button"
                onClick={addRow}
                className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-lg text-sm transition-all"
              >
                + Tambah Ukuran
              </button>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse md:flex-row gap-4 md:justify-end">
              <Link
                href="/admin/size-cards"
                className="flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg font-medium transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                {isLoading ? "Updating..." : "Update Template"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
