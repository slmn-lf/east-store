import React from "react";
import { cn } from "@/lib/utils/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  spacing?: "sm" | "md" | "lg";
}

/**
 * Section Component
 * Section wrapper with consistent spacing and background variants
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className,
  variant = "default",
  spacing = "md",
}) => {
  const variants = {
    default: "bg-transparent",
    glass: "bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl",
    gradient: "bg-gradient-to-br from-gray-800 to-black rounded-3xl",
  };

  const spacings = {
    sm: "py-4 sm:py-6",
    md: "py-8 sm:py-12",
    lg: "py-4 sm:py-16",
  };

  return (
    <section className={cn(spacings[spacing], variants[variant], className)}>
      {children}
    </section>
  );
};

Section.displayName = "Section";
