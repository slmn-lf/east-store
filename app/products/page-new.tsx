import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-2">Koleksi produk terbaru kami</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Produk tidak tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer h-full">
                  <div className="relative bg-slate-700 rounded-lg overflow-hidden aspect-square mb-4 border border-slate-600 hover:border-slate-500 transition-all duration-300">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-600 to-slate-800">
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === "pre_order"
                            ? "bg-orange-500/90 text-white"
                            : product.status === "coming_soon"
                              ? "bg-blue-500/90 text-white"
                              : "bg-red-500/90 text-white"
                        }`}
                      >
                        {product.status === "pre_order"
                          ? "Pre Order"
                          : product.status === "coming_soon"
                            ? "Coming Soon"
                            : "Closed"}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-2xl font-bold text-blue-400">
                      Rp {product.price_idr.toLocaleString("id-ID")}
                    </p>
                    <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
