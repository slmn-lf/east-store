import React from "react";
import Link from "next/link";
import { Container, Section } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { ProductGrid } from "@/app/components/products";
import type { Product } from "@/types";
import { prisma } from "@/lib/prisma";

/**
 * FeaturedProducts Section
 * Displays a grid of featured products fetched from the database
 */
export const FeaturedProducts: React.FC = async () => {
  // Fetch products from database
  let products: Product[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        status: {
          in: ["pre_order", "coming_soon"],
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        price_idr: true,
        image_url: true,
        url: true,
        status: true,
        wa_store: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 6, // Get 6 products but display first 4
    });

    // Transform to match Product type
    products = dbProducts.map((p) => ({
      id: p.id.toString(),
      slug: p.slug,
      title: p.title,
      description: p.description,
      price_idr: p.price_idr,
      image_url: p.image_url,
      url: p.url,
      status: p.status as "pre_order" | "coming_soon",
      wa_store: p.wa_store,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    // Fallback to empty array on error
    products = [];
  }

  // Display first 4 products
  const featuredProducts = products.slice(0, 4);
  return (
    <Section
      variant="default"
      spacing="lg"
      className="relative overflow-hidden"
    >
      {/* Background Elements */}
      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div> */}

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
              Featured Collections
            </h2>
            <p className="text-gray-400 text-lg">
              Koleksi terbatas yang dirancang dengan penuh detail dan cerita.
            </p>
          </div>
        </div>

        <ProductGrid products={featuredProducts} />
        <Link
          href="/products"
          className="mt-4 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border border-white/30 hover:bg-white/10 text-white focus:ring-white/50 px-4 py-2.5 text-base"
        >
          Lihat Semua Produk
        </Link>
      </Container>
    </Section>
  );
};
