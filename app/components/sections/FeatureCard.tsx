import React from "react";
import { Card } from "@/app/components/ui";
import { cn } from "@/lib/utils/cn";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

/**
 * FeatureCard Component
 * Reusable card for displaying features with icon, title, and description
 * Used in AboutSection and HowToOrder
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    className,
}) => {
    return (
        <Card variant="glass" className={cn("p-6", className)}>
            <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex-shrink-0 mt-0.5">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
                    <p className="text-gray-300 text-sm">{description}</p>
                </div>
            </div>
        </Card>
    );
};

FeatureCard.displayName = "FeatureCard";
