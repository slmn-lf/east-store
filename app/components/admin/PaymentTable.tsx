import React from "react";
import { Badge } from "@/app/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/app/components/ui/Table";
import { Payment } from "@/types";

interface PaymentTableProps {
  payments: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (paymentId: string) => void;
}

const paymentStatusVariants: Record<
  string,
  "success" | "warning" | "error" | "info"
> = {
  mentrack_pesanan: "info",
  dikonfirmasi: "warning",
  belum_lunas: "warning",
  lunas: "success",
};

const paymentStatusLabels: Record<string, string> = {
  mentrack_pesanan: "Mentrack Pesanan",
  dikonfirmasi: "Dikonfirmasi",
  belum_lunas: "Belum Lunas",
  lunas: "Lunas",
};

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const calculateProgress = (paid: number, total: number) => {
    return total > 0 ? Math.round((paid / total) * 100) : 0;
  };

  return (
    <Table variant="striped">
      <TableHead>
        <TableRow>
          <TableHeader>ID</TableHeader>
          <TableHeader>Nama Pemesan</TableHeader>
          <TableHeader>Nominal</TableHeader>
          <TableHeader>Terbayar</TableHeader>
          <TableHeader>Sisa Pembayaran</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Aksi</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-400">
              Tidak ada data pembayaran
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => {
            const remaining = Math.max(
              0,
              (payment.totalAmount || 0) - (payment.paidAmount || 0)
            );
            const isPaid = remaining === 0;

            const customerName =
              payment.order?.customerName || payment.orderId || "-";

            return (
              <TableRow key={payment.id}>
                <TableCell>
                  <span className="font-medium text-gray-200">
                    {payment.id}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{customerName}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300 font-medium">
                    {formatCurrency(payment.totalAmount || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300 font-medium">
                    {formatCurrency(payment.paidAmount || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300 font-medium">
                    {formatCurrency(remaining)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={isPaid ? "success" : "warning"}>
                    {isPaid ? "Lunas" : "Belum Lunas"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(payment)}
                        className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
