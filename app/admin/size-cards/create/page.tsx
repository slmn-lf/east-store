"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { logout } from "@/app/auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface SizeColumn {
  id: string;
  label: string;
  unit: string;
}

interface SizeRow {
  size: string;
  measurements: Record<string, number>;
}

interface SizeCardForm {
  name: string;
  description: string;
  columns: SizeColumn[];
  rows: SizeRow[];
}

export default function CreateSizeCardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<SizeCardForm>({
    name: "",
    description: "",
    columns: [
      { id: "panjang", label: "Panjang", unit: "cm" },
      { id: "lebarDada", label: "Lebar Dada", unit: "cm" },
      { id: "lebarBahu", label: "Lebar Bahu", unit: "cm" },
      { id: "panjangLengan", label: "Panjang Lengan", unit: "cm" },
    ],
    rows: [
      {
        size: "XS",
        measurements: {
          panjang: 65,
          lebarDada: 38,
          lebarBahu: 35,
          panjangLengan: 19,
        },
      },
      {
        size: "S",
        measurements: {
          panjang: 68,
          lebarDada: 41,
          lebarBahu: 37,
          panjangLengan: 20,
        },
      },
      {
        size: "M",
        measurements: {
          panjang: 71,
          lebarDada: 44,
          lebarBahu: 40,
          panjangLengan: 21,
        },
      },
      {
        size: "L",
        measurements: {
          panjang: 74,
          lebarDada: 47,
          lebarBahu: 42,
          panjangLengan: 22,
        },
      },
      {
        size: "XL",
        measurements: {
          panjang: 77,
          lebarDada: 50,
          lebarBahu: 44,
          panjangLengan: 23,
        },
      },
      {
        size: "2XL",
        measurements: {
          panjang: 80,
          lebarDada: 53,
          lebarBahu: 46,
          panjangLengan: 24,
        },
      },
    ],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.rows.length === 0) {
      newErrors.rows = "At least one size row is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRowChange = (
    index: number,
    field: "size" | "measurement",
    columnId?: string,
    value?: string | number
  ) => {
    setFormData((prev) => {
      const newRows = [...prev.rows];
      if (field === "size" && typeof value === "string") {
        newRows[index] = { ...newRows[index], size: value };
      } else if (field === "measurement" && columnId && value !== undefined) {
        newRows[index] = {
          ...newRows[index],
          measurements: {
            ...newRows[index].measurements,
            [columnId]: Number(value),
          },
        };
      }
      return { ...prev, rows: newRows };
    });
  };

  const addRow = () => {
    setFormData((prev) => {
      const newMeasurements: Record<string, number> = {};
      prev.columns.forEach((col) => {
        newMeasurements[col.id] = 0;
      });
      return {
        ...prev,
        rows: [
          ...prev.rows,
          {
            size: "",
            measurements: newMeasurements,
          },
        ],
      };
    });
  };

  const removeRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index),
    }));
  };

  const addColumn = () => {
    setFormData((prev) => {
      const newColumnId = `column_${Date.now()}`;
      const newColumns = [
        ...prev.columns,
        { id: newColumnId, label: "New Measurement", unit: "cm" },
      ];
      const newRows = prev.rows.map((row) => ({
        ...row,
        measurements: {
          ...row.measurements,
          [newColumnId]: 0,
        },
      }));
      return {
        ...prev,
        columns: newColumns,
        rows: newRows,
      };
    });
  };

  const removeColumn = (columnId: string) => {
    setFormData((prev) => {
      const newColumns = prev.columns.filter((col) => col.id !== columnId);
      const newRows = prev.rows.map((row) => {
        const newMeasurements = { ...row.measurements };
        delete newMeasurements[columnId];
        return {
          ...row,
          measurements: newMeasurements,
        };
      });
      return {
        ...prev,
        columns: newColumns,
        rows: newRows,
      };
    });
  };

  const updateColumn = (columnId: string, label: string, unit: string) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, label, unit } : col
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Transform rows data format for API
      const transformedRows = formData.rows.map((row) => ({
        size: row.size,
        ...row.measurements,
      }));

      // Create size card template with rows and columns
      const response = await fetch("/api/size-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          columns: formData.columns,
          rows: transformedRows,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to create size card";
        setErrors({ submit: errorMessage });
        throw new Error(errorMessage);
      }

      alert("Size card created successfully");
      router.push("/admin/size-cards");
    } catch (error) {
      console.error("Error creating size card:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create size card";
      setErrors({ submit: errorMessage });
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
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
        title="Create Size Card"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6 max-w-6xl">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin/size-cards"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="text-white" size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Create Size Card
              </h1>
              <p className="text-white/60 mt-1">
                Create a new size card template
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {errors.submit && (
              <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-200 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Size Card Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Tabel Ukuran T-Shirt"
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
                    placeholder="Optional: Add a description"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Size Rows and Columns */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              {/* Header with Add Row/Column Buttons */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Size Table</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addColumn}
                    className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 rounded-lg text-sm font-medium transition-all"
                  >
                    + Add Column
                  </button>
                  <button
                    type="button"
                    onClick={addRow}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-lg text-sm font-medium transition-all"
                  >
                    + Add Row
                  </button>
                </div>
              </div>

              {/* Column Configuration */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Column Configuration
                </h3>
                <div className="space-y-2">
                  {formData.columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex gap-2 items-center bg-white/5 p-2 rounded border border-white/10"
                    >
                      <input
                        type="text"
                        value={column.label}
                        onChange={(e) =>
                          updateColumn(column.id, e.target.value, column.unit)
                        }
                        placeholder="Column label"
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:bg-white/15"
                      />
                      <input
                        type="text"
                        value={column.unit}
                        onChange={(e) =>
                          updateColumn(column.id, column.label, e.target.value)
                        }
                        placeholder="Unit"
                        className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:bg-white/15"
                      />
                      <button
                        type="button"
                        onClick={() => removeColumn(column.id)}
                        disabled={formData.columns.length <= 1}
                        className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-red-400/30 text-red-300 rounded text-sm transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left px-4 py-3 text-white/80 font-medium min-w-20">
                        Size
                      </th>
                      {formData.columns.map((column) => (
                        <th
                          key={column.id}
                          className="text-right px-4 py-3 text-white/80 font-medium min-w-24"
                        >
                          {column.label} ({column.unit})
                        </th>
                      ))}
                      <th className="text-center px-4 py-3 text-white/80 font-medium min-w-16">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.rows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/10 hover:bg-white/5"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={row.size}
                            onChange={(e) =>
                              handleRowChange(
                                index,
                                "size",
                                undefined,
                                e.target.value
                              )
                            }
                            placeholder="XS, S, M, etc"
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:bg-white/15 text-sm"
                          />
                        </td>
                        {formData.columns.map((column) => (
                          <td key={column.id} className="px-4 py-3">
                            <input
                              type="number"
                              value={row.measurements[column.id] || 0}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "measurement",
                                  column.id,
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-right placeholder-white/40 focus:outline-none focus:bg-white/15 text-sm"
                            />
                          </td>
                        ))}
                        <td className="text-center px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded text-sm transition-all"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.rows && (
                <p className="text-red-400 text-sm mt-2">{errors.rows}</p>
              )}
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
                {isLoading ? "Creating..." : "Create Size Card"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
