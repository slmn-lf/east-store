import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        transaction_id: {
          startsWith: "PRE-",
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform payment records to include preorder data
    const paymentsWithPreorders = await Promise.all(
      payments.map(async (payment) => {
        // Extract preorder ID from transaction_id (format: PRE-{id})
        const preorderId = parseInt(
          payment.transaction_id?.replace("PRE-", "") || "0"
        );

        const preorder = await prisma.preorder.findUnique({
          where: { id: preorderId },
          include: {
            product: true,
          },
        });

        return {
          ...payment,
          preorder,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: paymentsWithPreorders,
        count: paymentsWithPreorders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pembayaran" },
      { status: 500 }
    );
  }
}
