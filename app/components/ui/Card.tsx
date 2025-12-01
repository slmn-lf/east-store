import React from "react";
import { cn } from "@/lib/utils/cn";
import type { CardProps } from "@/types";

/**
 * Card Component
 * Container with glassmorphism effect and variants
 */
export const Card: React.FC<CardProps> = ({
    children,
    className,
    variant = "default",
    hover = false,
}) => {
    const variants = {
        default: "bg-white/5 border border-white/10",
        glass: "bg-white/5 backdrop-blur-lg border border-white/10",
        gradient: "bg-gradient-to-br from-white/10 to-white/5 border border-white/10",
    };

    return (
        <div
            className={cn(
                "rounded-2xl overflow-hidden",
                variants[variant],
                hover && "transition-all duration-300 hover:bg-white/10 hover:shadow-xl",
                className
            )}
        >
            {children}
        </div>
    );
};

Card.displayName = "Card";
