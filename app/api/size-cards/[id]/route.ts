import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Detail size template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sizeCard = await prisma.sizeCardTemplate.findUnique({
      where: { id: Number(id) },
      include: { rows: { orderBy: { size: "asc" } } },
    });

    if (!sizeCard) {
      return NextResponse.json(
        { error: "Size template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sizeCard);
  } catch (error) {
    console.error("Fetch size template error:", error);
    return NextResponse.json(
      { error: "Failed to fetch size template" },
      { status: 500 }
    );
  }
}

// PUT: Update size template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, rows } = body;

    // Update template
    const sizeCard = await prisma.sizeCardTemplate.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      include: { rows: true },
    });

    // Update rows if provided
    if (rows && rows.length > 0) {
      // Delete existing rows
      await prisma.sizeCardRow.deleteMany({
        where: { template_id: Number(id) },
      });

      // Create new rows
      await prisma.sizeCardRow.createMany({
        data: rows.map((row: { size: string; panjang: number; lebarDada: number; lebarBahu: number; panjangLengan: number }) => ({
          template_id: Number(id),
          size: row.size,
          panjang: row.panjang,
          lebarDada: row.lebarDada,
          lebarBahu: row.lebarBahu,
          panjangLengan: row.panjangLengan,
        })),
      });
    }

    return NextResponse.json(sizeCard);
  } catch (error) {
    console.error("Update size template error:", error);
    return NextResponse.json(
      { error: "Failed to update size template" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus size template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.sizeCardTemplate.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Size template deleted successfully" });
  } catch (error) {
    console.error("Delete size template error:", error);
    return NextResponse.json(
      { error: "Failed to delete size template" },
      { status: 500 }
    );
  }
}
