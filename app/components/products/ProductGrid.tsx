import React from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";
import { cn } from "@/lib/utils/cn";

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    className?: string;
}

/**
 * ProductGrid Component
 * Responsive grid layout for displaying products
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return (
            <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white/5 rounded-2xl h-64 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16 text-white/70">
                <p className="text-lg">Tidak ada produk ditemukan</p>
            </div>
        );
    }

    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

ProductGrid.displayName = "ProductGrid";
