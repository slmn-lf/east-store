import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Semua size templates (as size cards)
export async function GET() {
  try {
    const sizeCards = await prisma.sizeCardTemplate.findMany({
      include: { rows: { orderBy: { size: "asc" } } },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(sizeCards);
  } catch (error) {
    console.error("Fetch size templates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch size templates" },
      { status: 500 }
    );
  }
}

// POST: Buat size card/template baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, rows, columns } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check if name already exists
    const existingTemplate = await prisma.sizeCardTemplate.findUnique({
      where: { name },
    });

    if (existingTemplate) {
      return NextResponse.json(
        { error: `Size card template with name "${name}" already exists` },
        { status: 409 }
      );
    }

    // Map rows data from new format to Prisma schema format
    const mappedRows =
      rows && rows.length > 0
        ? rows.map((row: any) => {
            // Extract measurements from the row object
            // Row can be in format: { size: "XS", panjang: 65, lebarDada: 38, ... }
            // Or: { size: "XS", measurements: { panjang: 65, lebarDada: 38, ... } }

            // Check if row has measurements object
            const measurements = row.measurements
              ? { ...row.measurements }
              : { ...row };

            // Remove 'size' from measurements if it exists
            delete measurements.size;

            // Set defaults for all required fields
            const defaultMeasurements = {
              panjang: 0,
              lebarDada: 0,
              lebarBahu: 0,
              panjangLengan: 0,
            };

            return {
              size: row.size || "",
              panjang: measurements.panjang ?? defaultMeasurements.panjang,
              lebarDada:
                measurements.lebarDada ?? defaultMeasurements.lebarDada,
              lebarBahu:
                measurements.lebarBahu ?? defaultMeasurements.lebarBahu,
              panjangLengan:
                measurements.panjangLengan ?? defaultMeasurements.panjangLengan,
            };
          })
        : [];

    const sizeCard = await prisma.sizeCardTemplate.create({
      data: {
        name,
        description: description || null,
        columns: columns ? JSON.stringify(columns) : null,
        rows:
          mappedRows.length > 0
            ? {
                create: mappedRows,
              }
            : undefined,
      },
      include: { rows: true },
    });

    return NextResponse.json(sizeCard, { status: 201 });
  } catch (error) {
    console.error("Create size template error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Check for specific error types
    if (errorMessage.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "A size card template with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: `Failed to create size template: ${errorMessage}` },
      { status: 500 }
    );
  }
}
