"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Search } from "lucide-react";

interface Preorder {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  product_id: number;
  size: string;
  quantity: number;
  total_price: number;
  status: "unconfirmed" | "confirmed";
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    title: string;
    slug: string;
    price_idr: number;
  };
}

export default function PreorderPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and fetch preorders
    const initPage = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }

        // Fetch preorders from database
        const preordersResponse = await fetch("/api/preorder", {
          credentials: "include",
        });
        if (preordersResponse.ok) {
          const data = await preordersResponse.json();
          console.log("[PREORDER PAGE] API Response:", data);
          console.log(
            "[PREORDER PAGE] Preorders count:",
            data.data?.length || 0
          );
          setPreorders(data.data || []);
        } else {
          console.error("[PREORDER PAGE] API Error:", preordersResponse.status);
          setError("Gagal mengambil data preorder");
        }
      } catch (error) {
        console.error("[PREORDER PAGE] Fetch Error:", error);
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Filter preorders berdasarkan search dan status
  const filteredPreorders = preorders.filter((preorder) => {
    const matchSearch =
      preorder.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preorder.customer_phone.includes(searchTerm) ||
      (preorder.product?.title?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      preorder.id.toString().includes(searchTerm);

    const matchStatus =
      statusFilter === "all" || preorder.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Hitung statistik
  const stats = {
    total: preorders.length,
    unconfirmed: preorders.filter((p) => p.status === "unconfirmed").length,
    confirmed: preorders.filter((p) => p.status === "confirmed").length,
  };

  const handleStatusToggle = async (
    preorderId: number,
    currentStatus: string
  ) => {
    // Only allow toggle from unconfirmed to confirmed
    if (currentStatus !== "unconfirmed") {
      alert(
        "Hanya status 'Belum Dikonfirmasi' yang bisa diubah ke 'Dikonfirmasi'"
      );
      return;
    }

    try {
      const response = await fetch(`/api/preorder/${preorderId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update the preorder in the state
        setPreorders(
          preorders.map((p) =>
            p.id === preorderId ? { ...p, status: "confirmed" } : p
          )
        );
        alert("Preorder berhasil dikonfirmasi dan masuk ke tahap pembayaran");
      } else {
        alert("Gagal mengubah status preorder");
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      alert("Terjadi kesalahan saat mengubah status");
    }
  };

  const handleDelete = async (preorderId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus preorder ini?")) {
      try {
        const response = await fetch(`/api/preorder/${preorderId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          setPreorders(preorders.filter((p) => p.id !== preorderId));
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

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
        title="Track Pesanan"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Track Pesanan
              </h1>
              <p className="text-gray-300">
                Kelola dan lacak semua pesanan produk preorder Anda
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Total Preorder"
                value={stats.total}
                color="bg-blue-500/20 border-blue-500/50"
              />
              <StatCard
                label="Belum Dikonfirmasi"
                value={stats.unconfirmed}
                color="bg-yellow-500/20 border-yellow-500/50"
              />
              <StatCard
                label="Dikonfirmasi (Pembayaran)"
                value={stats.confirmed}
                color="bg-green-500/20 border-green-500/50"
              />
            </div>

            {/* Filters and Search */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Cari nama, telepon, atau Order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: "all", label: "Semua Status" },
                    { value: "unconfirmed", label: "Belum Dikonfirmasi" },
                    { value: "confirmed", label: "Dikonfirmasi" },
                  ]}
                />
              </div>

              <div className="mt-4 text-sm text-gray-300">
                <p>
                  Menampilkan{" "}
                  <span className="font-semibold">
                    {filteredPreorders.length}
                  </span>{" "}
                  dari <span className="font-semibold">{preorders.length}</span>{" "}
                  preorder
                </p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm overflow-hidden">
              {error ? (
                <div className="p-6 text-center text-red-400">{error}</div>
              ) : filteredPreorders.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  Tidak ada preorder yang ditemukan
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Produk
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Telepon
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
                          Tgl
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-200">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPreorders.map((preorder) => (
                        <tr
                          key={preorder.id}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-100">
                            #{preorder.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100">
                            {preorder.product?.title || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100">
                            {preorder.customer_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100">
                            {preorder.customer_phone}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100">
                            {preorder.size}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100">
                            {preorder.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-100 font-semibold">
                            Rp {preorder.total_price.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {preorder.status === "unconfirmed" ? (
                              <button
                                onClick={() =>
                                  handleStatusToggle(
                                    preorder.id,
                                    preorder.status
                                  )
                                }
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${getStatusBadge(
                                  preorder.status
                                )}`}
                                title="Klik untuk konfirmasi dan lanjut ke pembayaran"
                              >
                                {formatStatus(preorder.status)}
                              </button>
                            ) : (
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                  preorder.status
                                )}`}
                              >
                                {formatStatus(preorder.status)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {new Date(preorder.created_at).toLocaleDateString(
                              "id-ID"
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDelete(preorder.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
// Component untuk Stat Card
interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className={`rounded-lg p-4 border backdrop-blur-md ${color}`}>
    <p className="text-sm text-gray-300 mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

function getStatusBadge(status: string): string {
  const statusMap: Record<string, string> = {
    unconfirmed: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50",
    confirmed: "bg-green-500/20 text-green-300 border border-green-500/50",
  };
  return statusMap[status] || "bg-gray-500/20 text-gray-300";
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    unconfirmed: "Belum Dikonfirmasi",
    confirmed: "Dikonfirmasi",
  };
  return statusMap[status] || status;
}
