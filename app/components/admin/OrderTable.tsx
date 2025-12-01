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
import { Order } from "@/types";

interface OrderTableProps {
  orders: Order[];
  onDelete?: (orderId: string) => void;
}

const statusVariants: Record<string, "success" | "warning" | "error" | "info"> =
  {
    pending: "warning",
    confirmed: "info",
    cancelled: "error",
  };

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  cancelled: "Dibatalkan",
};

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Table variant="striped">
      <TableHead>
        <TableRow>
          <TableHeader>Order ID</TableHeader>
          <TableHeader>Nama Pemesan</TableHeader>
          <TableHeader>No. Telepon</TableHeader>
          <TableHeader>Alamat</TableHeader>
          <TableHeader>Tanggal Pesan</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Aksi</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-400">
              Tidak ada data pesanan
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <span className="font-medium text-gray-200">{order.id}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-300">{order.customerName}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-400">{order.customerPhone}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-400 text-xs">
                  {order.customerAddress}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-400">
                  {formatDate(order.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[order.status] || "default"}>
                  {statusLabels[order.status] || order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {onDelete && (
                    <button
                      onClick={() => onDelete(order.id)}
                      className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
