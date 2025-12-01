"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
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

interface SizeColumn {
  id: string;
  label: string;
  unit: string;
}

interface SizeCardTemplate {
  id: number;
  name: string;
  description: string | null;
  columns: string | null;
  created_at: string;
  updated_at: string;
  rows: SizeCardRow[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SizeCardDetailPage({ params }: PageProps) {
  const [sizeCard, setSizeCard] = useState<SizeCardTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(p.id);
    })();
  }, [params]);

  const fetchSizeCardDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/size-cards/${id}`);
      if (!response.ok) throw new Error("Failed to fetch size card details");
      const data = await response.json();
      setSizeCard(data);
    } catch (error) {
      console.error("Error fetching size card:", error);
      setError("Failed to load size card details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSizeCardDetail();
    }
  }, [id, fetchSizeCardDetail]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this size card? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await fetch(`/api/size-cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete size card");

      alert("Size card deleted successfully");
      window.location.href = "/admin/size-cards";
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

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* Header */}
        <AdminHeader
          title="Size Card Details"
          isSidebarOpen={isSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {/* Back Button */}
          <Link
            href="/admin/size-cards"
            className="inline-flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Size Cards
          </Link>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
              <p className="text-gray-300 mt-4">Loading size card...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
              <p>{error}</p>
            </div>
          ) : sizeCard ? (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {sizeCard.name}
                    </h1>
                    {sizeCard.description && (
                      <p className="text-gray-400 mb-4">
                        {sizeCard.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <p className="text-white">
                          {new Date(sizeCard.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Updated:</span>
                        <p className="text-white">
                          {new Date(sizeCard.updated_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/size-cards/${id}/edit`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">
                    Size Measurements
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {
                      sizeCard.rows.filter(
                        (row) =>
                          row.panjang > 0 ||
                          row.lebarDada > 0 ||
                          row.lebarBahu > 0 ||
                          row.panjangLengan > 0
                      ).length
                    }{" "}
                    size variations
                  </p>
                </div>

                {sizeCard.rows.length > 0 ? (
                  (() => {
                    // Filter rows with valid data
                    const validRows = sizeCard.rows.filter(
                      (row) =>
                        row.panjang > 0 ||
                        row.lebarDada > 0 ||
                        row.lebarBahu > 0 ||
                        row.panjangLengan > 0
                    );

                    // Detect which columns have data
                    const hasData = {
                      panjang: validRows.some((row) => row.panjang > 0),
                      lebarDada: validRows.some((row) => row.lebarDada > 0),
                      lebarBahu: validRows.some((row) => row.lebarBahu > 0),
                      panjangLengan: validRows.some(
                        (row) => row.panjangLengan > 0
                      ),
                    };

                    // Parse columns from JSON string
                    let columns: SizeColumn[] = [];
                    if (sizeCard.columns) {
                      try {
                        columns = JSON.parse(sizeCard.columns);
                      } catch (e) {
                        console.error("Failed to parse columns:", e);
                      }
                    }

                    // Get column labels from definitions or use defaults
                    const getColumnLabel = (columnId: string) => {
                      if (columns.length > 0) {
                        const col = columns.find((c) => c.id === columnId);
                        if (col) {
                          return col.unit
                            ? `${col.label} (${col.unit})`
                            : col.label;
                        }
                      }
                      // Fallback to default labels
                      const defaults: Record<string, string> = {
                        panjang: "Panjang (cm)",
                        lebarDada: "Lebar Dada (cm)",
                        lebarBahu: "Lebar Bahu (cm)",
                        panjangLengan: "Panjang Lengan (cm)",
                      };
                      return defaults[columnId] || columnId;
                    };

                    return validRows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-700/50 border-b border-gray-700">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                                Size
                              </th>
                              {hasData.panjang && (
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                                  {getColumnLabel("panjang")}
                                </th>
                              )}
                              {hasData.lebarDada && (
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                                  {getColumnLabel("lebarDada")}
                                </th>
                              )}
                              {hasData.lebarBahu && (
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                                  {getColumnLabel("lebarBahu")}
                                </th>
                              )}
                              {hasData.panjangLengan && (
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                                  {getColumnLabel("panjangLengan")}
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {validRows.map((row, index) => (
                              <tr
                                key={row.id}
                                className={`border-b border-gray-700 ${
                                  index % 2 === 0
                                    ? "bg-gray-800/30"
                                    : "bg-gray-800/50"
                                } hover:bg-gray-700/50 transition-colors`}
                              >
                                <td className="px-6 py-4 text-sm font-medium text-white">
                                  {row.size}
                                </td>
                                {hasData.panjang && (
                                  <td className="px-6 py-4 text-sm text-gray-300">
                                    {row.panjang}
                                  </td>
                                )}
                                {hasData.lebarDada && (
                                  <td className="px-6 py-4 text-sm text-gray-300">
                                    {row.lebarDada}
                                  </td>
                                )}
                                {hasData.lebarBahu && (
                                  <td className="px-6 py-4 text-sm text-gray-300">
                                    {row.lebarBahu}
                                  </td>
                                )}
                                {hasData.panjangLengan && (
                                  <td className="px-6 py-4 text-sm text-gray-300">
                                    {row.panjangLengan}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        <p>No size measurements available</p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    <p>No size measurements available</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center text-gray-400">
              <p>Size card not found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
