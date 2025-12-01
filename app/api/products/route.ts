export const runtime = "nodejs";
// ...existing code...
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// GET: Semua produk
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: "desc" },
      include: {
        features: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", detail: String(error) },
      { status: 500 }
    );
  }
}

// POST: Tambah produk baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price_idr,
      image_url,
      images = [],
      url,
      status,
      wa_store,
      user_id,
      size_card_template_id,
      features = [],
    } = body;

    // Validasi required fields
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!price_idr || isNaN(Number(price_idr)) || Number(price_idr) <= 0) {
      return NextResponse.json(
        { error: "Price (IDR) is required and must be a positive number" },
        { status: 400 }
      );
    }

    if (!status || !["coming_soon", "pre_order", "close"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be one of: coming_soon, pre_order, close" },
        { status: 400 }
      );
    }

    if (!user_id || isNaN(Number(user_id)) || Number(user_id) <= 0) {
      return NextResponse.json(
        { error: "User ID is required and must be a positive number" },
        { status: 400 }
      );
    }

    // Validasi user exists
    const userExists = await prisma.adminUser.findUnique({
      where: { id: Number(user_id) },
    });

    if (!userExists) {
      // Create default admin user if it doesn't exist (for demo purposes)
      if (Number(user_id) === 1) {
        await prisma.adminUser
          .create({
            data: {
              id: 1,
              email: "admin@eaststore.local",
              password_hash: "demo_password", // This is just for demo, not actually used
              name: "Admin User",
              wa_store: wa_store || null,
              role: "admin",
            },
          })
          .catch(() => {
            // User might already exist, ignore error
          });
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    // Validasi wa_store format (optional but if provided, check format)
    if (wa_store && typeof wa_store !== "string") {
      return NextResponse.json(
        { error: "WhatsApp store must be a string" },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = generateSlug(title);

    // Check if slug already exists and make it unique
    let slugExists = await prisma.product.findUnique({
      where: { slug },
    });

    if (slugExists) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }

    // Create product with features and images
    const product = await prisma.product.create({
      data: {
        slug,
        title: title.trim(),
        description: description ? description.trim() : null,
        price_idr: Number(price_idr),
        image_url: image_url || (images.length > 0 ? images[0] : null),
        url: url ? url.trim() : null,
        status,
        wa_store: wa_store || null,
        size_card_template_id: size_card_template_id
          ? Number(size_card_template_id)
          : null,
        user_id: Number(user_id),
        features: {
          create: features
            .filter((f: any) => f.enabled)
            .map((f: any) => ({
              feature_type: f.type,
              custom_label: f.custom_label || null,
              custom_description: f.custom_description || null,
            })),
        },
        images: {
          create: images.map((imageUrl: string, idx: number) => ({
            image_url: imageUrl,
            order: idx,
          })),
        },
      },
      include: {
        features: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product", detail: String(error) },
      { status: 500 }
    );
  }
}

// PATCH: Update produk
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      price_idr,
      image_url,
      features = [],
    } = body;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Product id is required and must be a number" },
        { status: 400 }
      );
    }
    const updateData: any = {};
    if (title) {
      updateData.title = title;
      // Regenerate slug when title changes
      updateData.slug = generateSlug(title);
    }
    if (description) updateData.description = description;
    if (price_idr) updateData.price_idr = Number(price_idr);
    if (image_url) updateData.image_url = image_url;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // Update features if provided
    if (features.length > 0) {
      // Delete all existing features
      await prisma.productFeature.deleteMany({
        where: { product_id: Number(id) },
      });

      // Create new features
      await prisma.productFeature.createMany({
        data: features
          .filter((f: any) => f.enabled)
          .map((f: any) => ({
            product_id: Number(id),
            feature_type: f.type,
            custom_label: f.custom_label || null,
            custom_description: f.custom_description || null,
            custom_icon: f.custom_icon || null,
          })),
      });
    }

    // Fetch updated product with features
    const updatedProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        features: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product", detail: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Hapus produk
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Product id is required and must be a number" },
        { status: 400 }
      );
    }
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product", detail: String(error) },
      { status: 500 }
    );
  }
}
