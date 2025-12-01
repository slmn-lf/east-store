import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { SizeChart } from "@/app/components/SizeChart";
import { PurchaseForm } from "@/app/components/products/PurchaseForm";
import { ProductFeatures } from "@/app/components/products/ProductFeatures";
import { ProductImageGallery } from "@/app/components/products/ProductImageGallery";
import Link from "next/link";
import { Container, Section } from "@/app/components/layout";
import { Card } from "@/app/components/ui";
import { ArrowLeft, Truck, Shield, Check } from "lucide-react";

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await paramsPromise;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: `${product.title} | East Store`,
    description: product.description || product.title,
    openGraph: {
      title: product.title,
      description: product.description || product.title,
      url: `https://eaststore.local/products/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.image_url || "/placeholder.png",
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = await paramsPromise;
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          name: true,
          wa_store: true,
        },
      },
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
    notFound();
  }

  const whatsappMessage = `Halo, saya tertarik dengan produk: ${product.title} (Rp ${product.price_idr.toLocaleString("id-ID")})`;
  const whatsappLink = `https://wa.me/${product.wa_store}?text=${encodeURIComponent(whatsappMessage)}`;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pre_order":
        return "Pre-Order Available";
      case "coming_soon":
        return "Coming Soon";
      case "close":
        return "Sold Out";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pre_order":
        return "success";
      case "coming_soon":
        return "warning";
      case "close":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
      <Section variant="default" spacing="sm">
        <Container>
          {/* Header with Back Link and Status */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Kembali ke Produk
            </Link>
            <span className="px-4 py-2 rounded-lg text-sm font-semibold inline-block bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {getStatusLabel(product.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <div className="relative">
              {product.images && product.images.length > 0 ? (
                <ProductImageGallery images={product.images} />
              ) : product.image_url ? (
                <Card
                  variant="glass"
                  className="p-4 overflow-hidden aspect-square flex items-center justify-center bg-white/5 border-white/10"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </Card>
              ) : (
                <Card
                  variant="glass"
                  className="p-4 overflow-hidden aspect-square flex items-center justify-center bg-white/5 border-white/10"
                >
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-600 to-gray-800">
                    <span className="text-gray-400 text-lg">No Image</span>
                  </div>
                </Card>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.title}
              </h1>

              <div className="text-3xl font-bold text-amber-400 mb-8">
                Rp {product.price_idr.toLocaleString("id-ID")}
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {product.description || "Tidak ada deskripsi"}
                </p>
              </div>

              {/* Product Features - Display directly below description */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <ProductFeatures features={product.features} />
                </div>
              )}

              {/* CTA - Only show WhatsApp button for non pre_order status */}
            </div>
          </div>

          {/* Size Chart Section */}
          {product.sizeCardTemplate &&
          product.sizeCardTemplate.rows.length > 0 ? (
            (() => {
              // Parse columns from JSON string
              let columns: any[] = [];
              if (product.sizeCardTemplate.columns) {
                try {
                  columns = JSON.parse(product.sizeCardTemplate.columns);
                } catch (e) {
                  console.error("Failed to parse columns:", e);
                }
              }

              // Filter rows with valid data
              const validRows = product.sizeCardTemplate.rows.filter(
                (row) =>
                  row.panjang > 0 ||
                  row.lebarDada > 0 ||
                  row.lebarBahu > 0 ||
                  row.panjangLengan > 0
              );

              // Detect which columns have data based on column definitions or fallback to field detection
              const hasData =
                columns.length > 0
                  ? {
                      panjang: columns.some((col) => col.id === "panjang"),
                      lebarDada: columns.some((col) => col.id === "lebarDada"),
                      lebarBahu: columns.some((col) => col.id === "lebarBahu"),
                      panjangLengan: columns.some(
                        (col) => col.id === "panjangLengan"
                      ),
                    }
                  : {
                      panjang: validRows.some((row) => row.panjang > 0),
                      lebarDada: validRows.some((row) => row.lebarDada > 0),
                      lebarBahu: validRows.some((row) => row.lebarBahu > 0),
                      panjangLengan: validRows.some(
                        (row) => row.panjangLengan > 0
                      ),
                    };

              // Get column labels from definitions or use defaults
              const getColumnLabel = (columnId: string) => {
                if (columns.length > 0) {
                  const col = columns.find((c) => c.id === columnId);
                  if (col) {
                    return col.unit ? `${col.label} (${col.unit})` : col.label;
                  }
                }
                // Fallback to default labels
                const defaults: Record<string, string> = {
                  panjang: "Panjang (cm)",
                  lebarDada: "Lebar Dada (cm)",
                  lebarBahu: "Lebar Bahu (cm)",
                  panjangLengan: "Panjang Lengan (cm)",
                };
                return defaults[columnId] || columnId;
              };

              return validRows.length > 0 ? (
                <div className="mt-16 mb-16">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Tabel Ukuran T-Shirt
                    </h2>
                    <p className="text-gray-400">
                      Ukuran tersedia untuk produk ini (
                      {product.sizeCardTemplate.name})
                    </p>
                  </div>

                  <Card
                    variant="glass"
                    className="p-6 overflow-x-auto border-white/10"
                  >
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                            Ukuran
                          </th>
                          {hasData.panjang && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                              {getColumnLabel("panjang")}
                            </th>
                          )}
                          {hasData.lebarDada && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                              {getColumnLabel("lebarDada")}
                            </th>
                          )}
                          {hasData.lebarBahu && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                              {getColumnLabel("lebarBahu")}
                            </th>
                          )}
                          {hasData.panjangLengan && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                              {getColumnLabel("panjangLengan")}
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {validRows.map((row, index) => (
                          <tr
                            key={row.id}
                            className={`border-b border-white/5 ${
                              index % 2 === 0 ? "bg-white/5" : "bg-white/2"
                            }`}
                          >
                            <td className="px-4 py-3 text-sm font-medium text-white">
                              {row.size}
                            </td>
                            {hasData.panjang && (
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {row.panjang}
                              </td>
                            )}
                            {hasData.lebarDada && (
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {row.lebarDada}
                              </td>
                            )}
                            {hasData.lebarBahu && (
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {row.lebarBahu}
                              </td>
                            )}
                            {hasData.panjangLengan && (
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {row.panjangLengan}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
              ) : (
                <div className="mt-16 mb-16">
                  <SizeChart />
                </div>
              );
            })()
          ) : (
            <div className="mt-16 mb-16">
              <SizeChart />
            </div>
          )}

          {/* Purchase Form Section */}
          {product.status === "pre_order" ? (
            <div className="mt-16">
              <PurchaseForm
                productId={product.id}
                productTitle={product.title}
                productPrice={product.price_idr}
                waNumber={product.wa_store || ""}
              />
            </div>
          ) : product.status === "coming_soon" ? (
            <Card variant="glass" className="p-8 text-center mt-16">
              <p className="text-2xl font-bold text-yellow-400 mb-2">
                🔜 Akan Segera Hadir
              </p>
              <p className="text-gray-300">
                Produk ini akan segera tersedia. Nantikan pengumuman kami!
              </p>
            </Card>
          ) : (
            <Card variant="glass" className="p-8 text-center mt-16">
              <p className="text-2xl font-bold text-red-400 mb-2">
                ❌ Pre Order Selesai
              </p>
              <p className="text-gray-300">
                Periode pre-order untuk produk ini telah berakhir. Terima kasih
                atas minat Anda!
              </p>
            </Card>
          )}
        </Container>
      </Section>
    </div>
  );
}
