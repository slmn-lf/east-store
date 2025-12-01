"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { logout } from "@/app/auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";

interface Product {
  id: number;
  title: string;
  description?: string;
  price_idr: number;
  image_url?: string;
  url?: string;
  status: "coming_soon" | "pre_order" | "close";
  wa_store?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  features?: Array<{
    id: number;
    product_id: number;
    feature_type: string;
  }>;
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-300 border border-green-400/30",
  coming_soon: "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30",
  closed: "bg-red-500/20 text-red-300 border border-red-400/30",
  pre_order: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
  close: "bg-red-500/20 text-red-300 border border-red-400/30",
};

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const getStatusDisplay = (productStatus: string) => {
    const statusMap: Record<string, string> = {
      coming_soon: "coming_soon",
      pre_order: "active",
      close: "closed",
    };
    return statusMap[productStatus] || "coming_soon";
  };

  const getFeatureLabel = (featureType: string): string => {
    const featureMap: Record<string, string> = {
      premium_cotton: "Premium Cotton 24s",
      high_quality_plastisol: "High Quality Plastisol",
      nationwide_shipping: "Nationwide Shipping",
      quality_guarantee: "Quality Guarantee",
    };
    return featureMap[featureType] || featureType;
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800">
      {/* Mobile Navigation */}
      <AdminMobileNav onLogout={handleLogout} title="EastStore" />

      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header */}
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        title="Products"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Products</h1>
              <p className="text-white/60 mt-2">
                Manage your product inventory
              </p>
            </div>
            <Link
              href="/admin/products/create"
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </Link>
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-white/40"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-white/60">
                Loading products...
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/20 bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                          Product Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredProducts.map((product) => {
                        const status = getStatusDisplay(product.status);
                        return (
                          <tr
                            key={product.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4 text-white font-medium">
                              {product.title}
                            </td>
                            <td className="px-6 py-4 text-white/70">General</td>
                            <td className="px-6 py-4 text-white font-semibold">
                              Rp {product.price_idr.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-white/70">
                              <span
                                className={
                                  product.status === "coming_soon"
                                    ? "text-yellow-300"
                                    : "text-green-300"
                                }
                              >
                                {product.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  statusColors[status]
                                }`}
                              >
                                {status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/products/${product.id}/edit`}
                                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 transition-all"
                                >
                                  <Edit2 size={16} />
                                </Link>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 p-4">
                  {filteredProducts.map((product) => {
                    const status = getStatusDisplay(product.status);
                    return (
                      <div
                        key={product.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-semibold">
                              {product.title}
                            </h3>
                            <p className="text-white/60 text-sm">General</p>
                          </div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              statusColors[status]
                            }`}
                          >
                            {status.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-white/60">Price</p>
                            <p className="text-white font-semibold">
                              Rp {product.price_idr.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60">Status</p>
                            <p
                              className={
                                product.status === "coming_soon"
                                  ? "text-yellow-300"
                                  : "text-green-300"
                              }
                            >
                              {product.status.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-white/60 text-xs mb-2">
                              Features
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {product.features.map((feature) => (
                                <span
                                  key={feature.id}
                                  className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded text-xs"
                                >
                                  {getFeatureLabel(feature.feature_type)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 text-sm transition-all"
                          >
                            <Edit2 size={16} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 text-sm transition-all"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-white/60 text-lg">No products found</p>
                      <p className="text-white/40 text-sm mt-1">
                        Try adjusting your search terms
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-white/60 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </main>
    </div>
  );
}
