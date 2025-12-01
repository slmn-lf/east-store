import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

interface PaymentRecord {
  id: number;
  order_id: number | null;
  payment_method: string;
  amount_cents: number;
  paid_amount_cents: number;
  status: string;
  transaction_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paid_amount_cents } = body;

    if (paid_amount_cents === undefined) {
      return NextResponse.json(
        { error: "paid_amount_cents harus diisi" },
        { status: 400 }
      );
    }

    // Get current payment
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update payment with new paid amount using raw query for now
    const updatedPayment = await prisma.$queryRaw<PaymentRecord[]>`
      UPDATE payments 
      SET paid_amount_cents = ${paid_amount_cents}, updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    const paymentResult =
      Array.isArray(updatedPayment) && updatedPayment.length > 0
        ? updatedPayment[0]
        : payment;

    // Get preorder data
    const preorder = await prisma.preorder.findUnique({
      where: {
        id: parseInt(payment.transaction_id?.replace("PRE-", "") || "0"),
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...paymentResult,
          preorder,
        },
        message: "Pembayaran berhasil diperbarui",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui pembayaran" },
      { status: 500 }
    );
  }
}
