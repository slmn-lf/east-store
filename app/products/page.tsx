"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container, Section } from "@/app/components/layout";
import { Search, X } from "lucide-react";
import { useEffect } from "react";

interface Product {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  price_idr: number;
  image_url: string | null;
  status: "coming_soon" | "pre_order" | "close";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products berdasarkan search dan status
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, selectedStatus]);

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "pre_order", label: "Active" },
    { value: "coming_soon", label: "Coming Soon" },
    { value: "close", label: "Closed" },
  ];

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
  };

  return (
    <div className="mt-24 mb-4 mx-4 grow min-h-screen rounded-3xl bg-linear-to-br from-gray-800 to-black overflow-hidden">
      <Section variant="default" spacing="lg">
        <Container>
          {/* Search and Filter Section */}
          <div className="mb-6 mt-0 pt-0 flex flex-col gap-3">
            {/* Search Bar and Filter Row */}
            <div className="flex gap-3 md:gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all appearance-none cursor-pointer w-40 shrink-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a8a29e' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  paddingRight: "2.5rem",
                }}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery !== "" || selectedStatus !== "all") && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg font-medium hover:bg-red-500/30 transition-all text-sm w-full md:w-auto"
              >
                Hapus Filter
              </button>
            )}
          </div>

          {/* Results Info */}
          {!isLoading && (
            <div className="mb-6 text-sm text-gray-400">
              {filteredProducts.length} produk ditemukan
              {searchQuery && ` untuk "${searchQuery}"`}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-gray-400">Memuat produk...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-24 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-2">
                  Tidak ada produk yang ditemukan
                </p>
                {(searchQuery || selectedStatus !== "all") && (
                  <button
                    onClick={handleClearFilters}
                    className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
                  >
                    Coba hapus filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 hover:border-white/30 transition-all hover:shadow-lg hover:shadow-amber-500/10 flex flex-col h-full">
                    {/* Image Container */}
                    <div className="relative w-full aspect-square bg-linear-to-br from-gray-700 to-gray-900 overflow-hidden shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-600 to-gray-800">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block backdrop-blur-sm ${
                            product.status === "pre_order"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                              : product.status === "coming_soon"
                                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                                : "bg-red-500/20 text-red-300 border border-red-400/30"
                          }`}
                        >
                          {product.status === "pre_order"
                            ? "Active"
                            : product.status === "coming_soon"
                              ? "Coming Soon"
                              : "Closed"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex flex-col grow">
                      {/* Title */}
                      <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 grow">
                        {product.description || ""}
                      </p>

                      {/* Price */}
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-base md:text-lg font-bold text-amber-400">
                          Rp {product.price_idr.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* CTA */}
                      <div className="mt-2">
                        <button className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs md:text-sm font-semibold py-1.5 md:py-2 px-3 rounded-lg transition-all">
                          Lihat
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
