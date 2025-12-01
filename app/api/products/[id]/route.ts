import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        sizeCardTemplate: {
          include: {
            rows: {
              orderBy: { size: "asc" },
            },
          },
        },
        features: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);
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
      size_card_template_id,
      features = [],
    } = body;

    console.log(`🔄 Updating product ${productId} with data:`, {
      title,
      price_idr,
      images: images.length,
      features: features.length,
    });

    // Update main product data
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price_idr && { price_idr: Number(price_idr) }),
        ...(image_url && { image_url }),
        ...(url && { url }),
        ...(status && { status }),
        ...(wa_store !== undefined && { wa_store }),
        ...(size_card_template_id !== undefined && {
          size_card_template_id: size_card_template_id
            ? Number(size_card_template_id)
            : null,
        }),
      },
      include: {
        sizeCardTemplate: {
          include: {
            rows: {
              orderBy: { size: "asc" },
            },
          },
        },
        features: true,
      },
    });

    console.log("✅ Product main data updated");

    // Update images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      try {
        // Delete all existing images
        await prisma.productImage.deleteMany({
          where: { product_id: productId },
        });

        console.log(`🗑️ Deleted existing images for product ${productId}`);

        // Create new images
        const imageData = images.map((imageUrl: string, idx: number) => ({
          product_id: productId,
          image_url: imageUrl,
          order: idx,
        }));

        await prisma.productImage.createMany({
          data: imageData,
        });

        console.log(`✅ Created ${imageData.length} new images`);
      } catch (imageError) {
        console.error("Error updating images:", imageError);
        throw new Error(
          `Failed to update images: ${imageError instanceof Error ? imageError.message : "Unknown error"}`
        );
      }
    }

    // Update features if provided
    if (features && Array.isArray(features) && features.length > 0) {
      try {
        // Delete all existing features
        await prisma.productFeature.deleteMany({
          where: { product_id: productId },
        });

        console.log(`🗑️ Deleted existing features for product ${productId}`);

        // Create new features
        const enabledFeatures = features
          .filter((f: any) => f.enabled)
          .map((f: any) => ({
            product_id: productId,
            feature_type: f.type,
            custom_label: f.custom_label || null,
            custom_description: f.custom_description || null,
          }));

        if (enabledFeatures.length > 0) {
          await prisma.productFeature.createMany({
            data: enabledFeatures,
          });

          console.log(`✅ Created ${enabledFeatures.length} new features`);
        }
      } catch (featureError) {
        console.error("Error updating features:", featureError);
        throw new Error(
          `Failed to update features: ${featureError instanceof Error ? featureError.message : "Unknown error"}`
        );
      }
    }

    // Fetch updated product with all relations
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        sizeCardTemplate: {
          include: {
            rows: {
              orderBy: { size: "asc" },
            },
          },
        },
        features: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    console.log("✅ Product updated successfully");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating product:", errorMessage);
    return NextResponse.json(
      { error: `Failed to update product: ${errorMessage}` },
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
    const productId = Number(id);
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
