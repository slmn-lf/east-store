import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total preorders (treating as orders)
    const totalPreorders = await prisma.preorder.count();

    // Get total guest orders
    const totalGuestOrders = await prisma.guestOrder.count();

    // Get total orders (preorders + guest orders)
    const totalOrders = totalPreorders + totalGuestOrders;

    // Get total admin users (Active Users)
    const activeUsers = await prisma.adminUser.count();

    // Get total revenue from payments (sum of paid amounts)
    const paymentResult = await prisma.payment.aggregate({
      _sum: {
        paid_amount_cents: true,
      },
    });

    const revenueCents = paymentResult._sum.paid_amount_cents || 0;
    const revenueRupiah = Math.floor(revenueCents / 100);

    return NextResponse.json(
      {
        totalProducts,
        totalOrders,
        activeUsers,
        revenue: revenueRupiah,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
