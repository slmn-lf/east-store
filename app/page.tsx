import React from "react";
import {
  Hero,
  HowToOrder,
  AboutSection,
  FeaturedProducts,
} from "@/app/components/sections";

/**
 * Homepage
 * Main landing page with hero, how to order, and about sections
 */
export default function HomePage() {
  return (
    <div className="mt-24 mb-4 mx-4 grow">
      <div className="rounded-3xl bg-linear-to-br from-gray-800 to-black">
        <Hero />
        <HowToOrder />
        <FeaturedProducts />
        <AboutSection />
      </div>
    </div>
  );
}
