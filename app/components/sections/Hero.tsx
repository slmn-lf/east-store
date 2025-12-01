import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { getAllContentSettings } from "@/app/admin/settings/actions";

/**
 * Hero Section Component
 * Landing page hero with CTA buttons and featured image
 */
export const Hero: React.FC = async () => {
  // Fetch content settings from database
  const settings = await getAllContentSettings();
  const heroSettings = settings.hero || {};

  // Fallback to defaults if not set
  const heroTitle = heroSettings.heroTitle || "Wear Art, Not Just Clothes";
  const heroDescription =
    heroSettings.heroDescription ||
    "Setiap kaos kami adalah kanvas untuk karya seni asli — diilustrasikan secara digital, dibuat dengan presisi, dan diproduksi eksklusif dalam sistem pre-order.";
  const heroCta1 = heroSettings.heroCta1 || "Pre Order Tersedia";
  const heroCta1Link = heroSettings.heroCta1Link || "/products";
  const heroCta2 = heroSettings.heroCta2 || "Kolaborasi Art Work";
  const heroCta2Link = heroSettings.heroCta2Link || "/artwork";
  const heroImage = heroSettings.heroImage || "/east.png";

  return (
    <Section variant="default" spacing="lg">
      <Container>
        <div className="pt-0 mt-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Text & CTA */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
              {heroTitle.split("Not Just").length === 2 ? (
                <>
                  {heroTitle.split("Not Just")[0]}
                  <span className="text-amber-400">Art</span>, Not Just
                  {heroTitle.split("Clothes")[0].includes("Clothes") ? (
                    <>
                      <br /> <span className="text-blue-300">Clothes</span>
                    </>
                  ) : (
                    " Clothes"
                  )}
                </>
              ) : (
                heroTitle
              )}
            </h1>

            <p className="mt-6 text-lg text-gray-300">{heroDescription}</p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={heroCta1Link}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-gray-900 focus:ring-amber-500 shadow-lg hover:shadow-xl px-6 py-3.5 text-lg"
              >
                {heroCta1}
              </Link>

              <Link
                href={heroCta2Link}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border border-white/30 hover:bg-white/10 text-white focus:ring-white/50 px-6 py-3.5 text-lg"
              >
                {heroCta2}
              </Link>
            </div>
          </div>

          {/* Right Column: Featured Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative max-w-md w-full">
              <Image
                src={heroImage}
                alt="T-shirt dengan desain ilustrasi bergaya lukisan cat minyak atau sketsa tangan"
                width={600}
                height={600}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

Hero.displayName = "Hero";
