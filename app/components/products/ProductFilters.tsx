"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input, Select } from "@/app/components/ui";
import { PRODUCT_STATUS_OPTIONS } from "@/config/constants";

interface ProductFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

/**
 * ProductFilters Component
 * Search and filter controls for product listing
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
}) => {
    return (
        <div className="mb-8">
            <div className="flex flex-row gap-3">
                {/* Search Bar */}
                <div className="flex-1 min-w-0 relative">
                    <input
                        type="text"
                        placeholder="Cari Article..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 pl-5 pr-10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Search
                        className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                        strokeWidth={2}
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="w-1/3 md:w-auto md:max-w-[180px] relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                    >
                        <option value="">Semua</option>
                        {PRODUCT_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none"
                        strokeWidth={2}
                    />
                </div>
            </div>
        </div>
    );
};

ProductFilters.displayName = "ProductFilters";
