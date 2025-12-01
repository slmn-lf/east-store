"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Edit, Trash2 } from "lucide-react";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";
import { logout } from "@/app/auth/login/actions";

interface SizeCardRow {
  id: number;
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

export default function SizeCardsPage() {
  const [sizeCards, setSizeCards] = useState<SizeCardTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchSizeCards();
  }, []);

  const fetchSizeCards = async () => {
    try {
      const response = await fetch("/api/size-cards");
      if (!response.ok) throw new Error("Failed to fetch size cards");
      const data = await response.json();
      setSizeCards(data);
    } catch (error) {
      console.error("Error fetching size cards:", error);
      alert("Failed to load size cards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this size card?")) return;

    try {
      const response = await fetch(`/api/size-cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete size card");

      setSizeCards(sizeCards.filter((card) => card.id !== id));
      alert("Size card deleted successfully");
    } catch (error) {
      console.error("Error deleting size card:", error);
      alert("Failed to delete size card");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
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
        title="Size Cards"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-white" size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Size Cards</h1>
                <p className="text-white/60 mt-1">
                  Kelola size card untuk produk
                </p>
              </div>
            </div>

            <Link
              href="/admin/size-cards/create"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              Buat Baru
            </Link>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          ) : sizeCards.length === 0 ? (
            <div className="flex items-center justify-center py-24 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-4">
                  Belum ada size card
                </p>
                <Link
                  href="/admin/size-cards/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all"
                >
                  <Plus size={20} />
                  Buat Size Card Pertama
                </Link>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Nama Template
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Jumlah Ukuran
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Dibuat
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCards.map((card) => (
                      <tr
                        key={card.id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          <Link
                            href={`/admin/size-cards/${card.id}`}
                            className="hover:text-amber-400 transition-colors"
                          >
                            {card.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-white/70">
                          {card.description || "-"}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {card.rows?.length || 0} ukuran
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {new Date(card.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/size-cards/${card.id}/edit`}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-amber-400 hover:text-amber-300"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
