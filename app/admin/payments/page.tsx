"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../auth/login/actions";
import { Payment, PaymentStatus, Order, OrderStatus } from "@/types";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";
import { PaymentTable } from "@/app/components/admin/PaymentTable";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Search, Download } from "lucide-react";

export default function PaymentsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPayment, setEditingPayment] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Check authentication and fetch payments
    const initPage = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }

        // Fetch payments from database
        const paymentsResponse = await fetch("/api/payments", {
          credentials: "include",
        });
        if (paymentsResponse.ok) {
          const data = await paymentsResponse.json();
          setPayments(data.data || []);
        }
      } catch (error) {
        console.error("Auth check or fetch failed:", error);
        router.push("/auth/login");
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

  // Filter payments berdasarkan search dan status
  const filteredPayments = payments.filter((payment) => {
    const preorder = payment.preorder;
    const matchSearch =
      payment.id.toString().includes(searchTerm) ||
      preorder?.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false ||
      preorder?.customer_phone.includes(searchTerm) ||
      false;

    const matchStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Hitung statistik yang dibutuhkan:
  // 1) total pemesan
  // 2) total belum lunas (count pesanan dengan sisa > 0)
  // 3) total rupiah terbayar (jumlah paid_amount_cents)
  // 4) total sisa pembayaran (jumlah sisa per pesanan)
  const stats = {
    totalPemesan: payments.length,
    totalBelumLunas: payments.filter(
      (p) => (p.amount_cents || 0) - (p.paid_amount_cents || 0) > 0
    ).length,
    totalTerbayarCents: payments.reduce(
      (sum, p) => sum + (p.paid_amount_cents || 0),
      0
    ),
    totalSisaCents: payments.reduce(
      (sum, p) =>
        sum + Math.max(0, (p.amount_cents || 0) - (p.paid_amount_cents || 0)),
      0
    ),
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
    setShowEditModal(true);
  };

  const handleDelete = (paymentId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pembayaran ini?")) {
      setPayments(payments.filter((p) => p.id !== paymentId));
    }
  };

  const handleUpdatePayment = async (paymentId: number, paidAmount: number) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paid_amount_cents: paidAmount * 100 }),
      });

      if (response.ok) {
        const result = await response.json();
        setPayments(
          payments.map((p) => (p.id === paymentId ? result.data : p))
        );
        setShowEditModal(false);
        setEditingPayment(null);
        alert("Pembayaran berhasil diperbarui");
      } else {
        alert("Gagal memperbarui pembayaran");
      }
    } catch (error) {
      console.error("Update payment error:", error);
      alert("Terjadi kesalahan saat memperbarui pembayaran");
    }
  };

  const exportToCSV = () => {
    // Summary totals
    const totalPesanan = filteredPayments.length;
    const totalPendapatanCents = filteredPayments.reduce(
      (sum, p) => sum + (p.amount_cents || 0),
      0
    );
    const totalTerbayarCents = filteredPayments.reduce(
      (sum, p) => sum + (p.paid_amount_cents || 0),
      0
    );
    const totalSisaCents = Math.max(
      0,
      totalPendapatanCents - totalTerbayarCents
    );
    const totalBelumLunas = filteredPayments.filter(
      (p) => (p.amount_cents || 0) - (p.paid_amount_cents || 0) > 0
    ).length;

    const summaryLines = [
      ["Summary", ""].join(","),
      ["Total Pesanan", totalPesanan].join(","),
      [
        "Total Pendapatan (IDR)",
        `Rp ${(totalPendapatanCents / 100).toLocaleString("id-ID")}`,
      ].join(","),
      [
        "Total Terbayar (IDR)",
        `Rp ${(totalTerbayarCents / 100).toLocaleString("id-ID")}`,
      ].join(","),
      [
        "Total Sisa (IDR)",
        `Rp ${(totalSisaCents / 100).toLocaleString("id-ID")}`,
      ].join(","),
      ["Total Pemesanan Belum Lunas", totalBelumLunas].join(","),
      [""].join(","),
    ];

    const headers = [
      "Payment ID",
      "Preorder ID",
      "Nama Pemesan",
      "Nominal (IDR)",
      "Terbayar (IDR)",
      "Sisa (IDR)",
      "Status",
      "Metode Pembayaran",
      "Tanggal Pembayaran",
    ];

    const rows = filteredPayments.map((payment) => {
      const preorder = payment.preorder;
      const totalAmount = payment.amount_cents || 0;
      const paidAmount = payment.paid_amount_cents || 0;
      const sisa = Math.max(0, totalAmount - paidAmount);
      return [
        payment.id,
        preorder?.id || "-",
        `"${preorder?.customer_name || "-"}"`,
        (totalAmount / 100).toLocaleString("id-ID"),
        (paidAmount / 100).toLocaleString("id-ID"),
        (sisa / 100).toLocaleString("id-ID"),
        payment.status,
        payment.payment_method || "-",
        new Date(payment.created_at).toLocaleDateString("id-ID"),
      ].join(",");
    });

    const csv = [...summaryLines, headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payments_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
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
        title="Pembayaran"
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
                Manajemen Pembayaran
              </h1>
              <p className="text-gray-300">
                Kelola dan track pembayaran pesanan produk
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Pemesan"
                value={stats.totalPemesan}
                color="bg-blue-500/20 border-blue-500/50"
              />
              <StatCard
                label="Total Belum Lunas"
                value={stats.totalBelumLunas}
                color="bg-yellow-500/20 border-yellow-500/50"
              />
              <StatCard
                label="Total Rupiah Terbayar"
                value={`Rp ${(stats.totalTerbayarCents / 100).toLocaleString("id-ID")}`}
                color="bg-green-500/20 border-green-500/50"
              />
              <StatCard
                label="Total Sisa Pembayaran"
                value={`Rp ${(stats.totalSisaCents / 100).toLocaleString("id-ID")}`}
                color="bg-purple-500/20 border-purple-500/50"
              />
            </div>

            {/* Filters and Search */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Cari Payment ID, Order ID, atau nama pemesan..."
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
                    { value: "pending", label: "Pending" },
                    { value: "confirmed", label: "Dikonfirmasi" },
                    { value: "completed", label: "Selesai" },
                  ]}
                />

                {/* Export Button */}
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-300">
                <p>
                  Menampilkan{" "}
                  <span className="font-semibold">
                    {filteredPayments.length}
                  </span>{" "}
                  dari <span className="font-semibold">{payments.length}</span>{" "}
                  pembayaran
                </p>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-sm overflow-hidden p-6">
              <PaymentTable
                payments={filteredPayments.map((p) => {
                  const payment: Payment = {
                    id: p.id,
                    orderId: p.preorder?.id || "-",
                    order: p.preorder
                      ? {
                          id: p.preorder.id,
                          productId: p.preorder.product_id || "",
                          customerName: p.preorder.customer_name || "-",
                          customerPhone: p.preorder.customer_phone || "",
                          customerAddress: p.preorder.customer_address || "",
                          status: "pending" as OrderStatus,
                          createdAt:
                            p.preorder.created_at || new Date().toISOString(),
                          updatedAt:
                            p.preorder.updated_at || new Date().toISOString(),
                        }
                      : undefined,
                    totalAmount: Math.round((p.amount_cents || 0) / 100),
                    paidAmount: Math.round((p.paid_amount_cents || 0) / 100),
                    paymentStatus: (p.status || "belum_lunas") as PaymentStatus,
                    createdAt: p.created_at || new Date().toISOString(),
                    updatedAt: p.updated_at || new Date().toISOString(),
                  };
                  return payment;
                })}
                onEdit={(payment) => {
                  // Find original payment object and open edit modal
                  const orig = filteredPayments.find(
                    (pp) => pp.id === payment.id
                  );
                  setEditingPayment(orig || payment);
                  setShowEditModal(true);
                }}
              />
            </div>

            {/* Edit Payment Modal */}
            {showEditModal && editingPayment && (
              <EditPaymentModal
                payment={editingPayment}
                onClose={() => {
                  setShowEditModal(false);
                  setEditingPayment(null);
                }}
                onSave={handleUpdatePayment}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Component untuk Stat Card
interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className={`rounded-lg p-4 border backdrop-blur-md ${color}`}>
    <p className="text-sm text-gray-300 mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

function getPaymentStatusBadge(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50",
    confirmed: "bg-green-500/20 text-green-300 border border-green-500/50",
    completed: "bg-blue-500/20 text-blue-300 border border-blue-500/50",
  };
  return statusMap[status] || "bg-gray-500/20 text-gray-300";
}

function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    confirmed: "Dikonfirmasi",
    completed: "Selesai",
  };
  return statusMap[status] || status;
}

// Modal untuk Edit Payment
interface EditPaymentModalProps {
  payment: any;
  onClose: () => void;
  onSave: (paymentId: number, paidAmount: number) => void;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  payment,
  onClose,
  onSave,
}) => {
  const [paidAmount, setPaidAmount] = useState<number>(
    payment.paid_amount_cents ? payment.paid_amount_cents / 100 : 0
  );
  const totalAmount = payment.amount_cents ? payment.amount_cents / 100 : 0;
  const remaining = totalAmount - paidAmount;
  const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paidAmount < 0 || paidAmount > totalAmount) {
      alert(
        `Nominal pembayaran harus antara 0 hingga Rp ${totalAmount.toLocaleString("id-ID")}`
      );
      return;
    }
    onSave(payment.id, paidAmount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/20">
          <h2 className="text-lg font-semibold text-white">
            Edit Pembayaran #{payment.id}
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {payment.preorder?.customer_name || "-"} - #
            {payment.preorder?.id || "-"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Total Amount */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Total Nominal</p>
            <p className="text-2xl font-bold text-white">
              Rp {totalAmount.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-300">Progress Pembayaran</p>
              <span className="text-sm font-semibold text-white">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div
                className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Paid Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nominal Yang Sudah Dibayar (Rp)
            </label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              min="0"
              max={totalAmount}
              step="1000"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-2">
              Sisa: Rp {remaining.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
