import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all preorders with product details
    const preorders = await prisma.preorder.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price_idr: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: preorders,
        count: preorders.length,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi input
    const {
      customer_name,
      customer_phone,
      customer_address,
      product_id,
      size,
      quantity,
    } = body;

    if (
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !product_id ||
      !size ||
      !quantity
    ) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Validasi nomor telepon (harus dimulai dengan 0 atau 62)
    const phoneRegex = /^(0|62)[0-9]{9,12}$/;
    if (!phoneRegex.test(customer_phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Nomor telepon tidak valid" },
        { status: 400 }
      );
    }

    // Cek product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(product_id) },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hitung total harga
    const totalPrice = product.price_idr * parseInt(quantity);

    // Buat preorder
    const preorder = await prisma.preorder.create({
      data: {
        customer_name,
        customer_phone,
        customer_address,
        product_id: parseInt(product_id),
        size,
        quantity: parseInt(quantity),
        total_price: totalPrice,
        status: "unconfirmed",
      },
      include: {
        product: true,
      },
    });

    // Buat payment record
    const payment = await prisma.payment.create({
      data: {
        payment_method: "whatsapp",
        amount_cents: totalPrice * 100, // Convert to cents
        status: "pending",
        transaction_id: `PRE-${preorder.id}`,
      },
    });

    // Update preorder dengan payment_id
    const updatedPreorder = await prisma.preorder.update({
      where: { id: preorder.id },
      data: { payment_id: payment.id },
      include: { product: true },
    });

    return NextResponse.json(
      {
        success: true,
        preorder: updatedPreorder,
        message: "Preorder berhasil dibuat",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Preorder error:", error);
    return NextResponse.json(
      { error: "Gagal membuat preorder" },
      { status: 500 }
    );
  }
}
