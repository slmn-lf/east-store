import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const preorder = await prisma.preorder.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true,
      },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: preorder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch preorder error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data preorder" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status harus diisi" },
        { status: 400 }
      );
    }

    // Validate status
    if (!["unconfirmed", "confirmed"].includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid. Harus 'unconfirmed' atau 'confirmed'" },
        { status: 400 }
      );
    }

    // Get current preorder
    const preorder = await prisma.preorder.findUnique({
      where: { id: parseInt(id) },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update preorder status
    const updatedPreorder = await prisma.preorder.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        product: true,
      },
    });

    // If status changed to "confirmed", create/update payment record
    if (status === "confirmed") {
      // Check if payment already exists
      const existingPayment = await prisma.payment.findFirst({
        where: {
          transaction_id: `PRE-${preorder.id}`,
        },
      });

      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            payment_method: "preorder",
            amount_cents: preorder.total_price * 100,
            status: "pending",
            transaction_id: `PRE-${preorder.id}`,
          },
        });
      } else {
        // Update existing payment status
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { status: "pending" },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedPreorder,
        message: "Status preorder berhasil diperbarui",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update preorder error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui preorder" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const preorder = await prisma.preorder.findUnique({
      where: { id: parseInt(id) },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete related payment records
    await prisma.payment.deleteMany({
      where: {
        transaction_id: `PRE-${preorder.id}`,
      },
    });

    // Delete preorder
    await prisma.preorder.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { success: true, message: "Preorder berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete preorder error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus preorder" },
      { status: 500 }
    );
  }
}
