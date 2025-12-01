import React from "react";
import { cn } from "@/lib/utils/cn";
import type { BadgeProps } from "@/types";

/**
 * Badge Component
 * Small status indicator with color variants
 */
export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "default",
    size = "md",
}) => {
    const variants = {
        success: "bg-green-500/20 text-green-200 border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
        error: "bg-red-500/20 text-red-200 border-red-500/30",
        info: "bg-blue-500/20 text-blue-200 border-blue-500/30",
        default: "bg-gray-500/20 text-gray-200 border-gray-500/30",
    };

    const sizes = {
        sm: "px-1.5 py-0.5 text-xs",
        md: "px-2 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded border",
                variants[variant],
                sizes[size]
            )}
        >
            {children}
        </span>
    );
};

Badge.displayName = "Badge";
