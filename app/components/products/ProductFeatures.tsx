"use client";

import { CheckCircle } from "lucide-react";

interface ProductFeature {
  id: number;
  product_id: number;
  feature_type: string;
  custom_label?: string | null;
  custom_description?: string | null;
  custom_icon?: string | null;
}

interface ProductFeaturesProps {
  features?: ProductFeature[];
}

const featureConfig: Record<
  string,
  { label: string; description: string; icon: string }
> = {
  premium_cotton: {
    label: "Premium Cotton 24s",
    description: "High quality cotton material",
    icon: "🧵",
  },
  high_quality_plastisol: {
    label: "High Quality Plastisol",
    description: "Professional grade printing",
    icon: "🖨️",
  },
  nationwide_shipping: {
    label: "Nationwide Shipping",
    description: "Available for delivery across the country",
    icon: "🚚",
  },
  quality_guarantee: {
    label: "Quality Guarantee",
    description: "100% quality assurance",
    icon: "✓",
  },
};

export function ProductFeatures({ features }: ProductFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Product Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => {
          const config = featureConfig[feature.feature_type];
          if (!config) return null;

          const label = feature.custom_label || config.label;
          const description = feature.custom_description || config.description;

          return (
            <div
              key={feature.id}
              className="flex items-start p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <p className="text-white font-medium">{label}</p>
                <p className="text-white/60 text-sm">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FeaturesPreview({ features }: ProductFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature) => {
        const config = featureConfig[feature.feature_type];
        if (!config) return null;

        const label = feature.custom_label || config.label;

        return (
          <div
            key={feature.id}
            className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-sm"
          >
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
