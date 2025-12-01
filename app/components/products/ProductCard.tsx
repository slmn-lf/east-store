import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Badge, Button } from "@/app/components/ui";
import { formatRupiah } from "@/lib/utils/formatters";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * ProductCard Component
 * Displays product information with image, price, and CTA
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "coming_soon":
        return "warning";
      case "closed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Pre-Order";
      case "coming_soon":
        return "Coming Soon";
      case "closed":
        return "Sold Out";
      default:
        return status;
    }
  };

  return (
    <Card variant="glass" hover className={className}>
      {/* Image Container */}
      <div className="relative">
        <Link href={`/products/${product.slug || product.id}`}>
          <Image
            src={
              product.images?.[0] ||
              product.image_url ||
              "/artwork-placeholder.svg"
            }
            alt={product.name || product.title || "Product"}
            width={600}
            height={600}
            className="w-full h-48 object-cover"
          />
        </Link>

        {/* Status Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge variant={getStatusVariant(product.status)} size="sm">
            {getStatusLabel(product.status)}
          </Badge>
        </div>

        {/* Mobile CTA Button */}
        <Link
          href={`/products/${product.slug || product.id}`}
          className="absolute bottom-2 right-2 sm:hidden z-10 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-br from-yellow-500 to-orange-500 hover:bg-white/10 text-white focus:ring-white/50 px-4 py-2.5 text-base"
        >
          Pesan
        </Link>
      </div>

      {/* Desktop Content */}
      <div className="p-3 hidden sm:block">
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="font-bold text-white text-sm line-clamp-1 hover:text-amber-400 transition-colors">
            {product.name || product.title}
          </h3>
        </Link>

        {product.description && (
          <p className="text-gray-300 text-xs mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-2">
          <span className="text-base font-bold text-white">
            {product.price
              ? formatRupiah(product.price)
              : `Rp ${(product.price_idr || 0).toLocaleString("id-ID")}`}
          </span>
        </div>

        {/* CTA Button */}
        <div className="flex gap-2 mt-3">
          <Link
            href={`/products/${product.slug || product.id}`}
            className={`flex-1 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-gray-900 focus:ring-amber-500 shadow-lg hover:shadow-xl px-4 py-2.5 text-base ${
              product.status === "closed"
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            Pesan
          </Link>
        </div>
      </div>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";
