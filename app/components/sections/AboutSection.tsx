import React from "react";
import { Container, Section } from "@/app/components/layout";
import { Card } from "@/app/components/ui";
import { FeatureCard } from "./FeatureCard";
import { getAllContentSettings } from "@/app/admin/settings/actions";

export const AboutSection: React.FC = async () => {
  const settings = await getAllContentSettings();
  const aboutSettings = settings.about || {};

  const features = [
    {
      icon: "🌱",
      title: aboutSettings.aboutfeature1title || "Ramah Lingkungan",
      description:
        aboutSettings.aboutfeature1desc ||
        "Zero overproduction. Setiap kaos dibuat hanya untuk yang memesan — mengurangi limbah tekstil hingga 95%.",
    },
    {
      icon: "🎨",
      title: aboutSettings.aboutfeature2title || "Kolaborasi Artistik",
      description:
        aboutSettings.aboutfeature2desc ||
        "Setiap desain adalah kolaborasi dengan ilustrator & seniman lokal — kamu tidak hanya beli kaos, tapi juga mendukung karya mereka.",
    },
    {
      icon: "🤝",
      title: aboutSettings.aboutfeature3title || "Komunitas Eksklusif",
      description:
        aboutSettings.aboutfeature3desc ||
        "Pemilik koleksi mendapat akses ke grup WhatsApp eksklusif, early access untuk drop berikutnya, dan voting desain baru.",
    },
  ];

  return (
    <Section variant="default" spacing="md">
      <Container>
        {/* Header */}
        <div className="text-start mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {aboutSettings.abouttitle || "Tentang"}{" "}
            <span className="text-amber-400">
              {aboutSettings.aboutsubtitle || "Kami"}
            </span>
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl">
            {aboutSettings.aboutcontent ||
              "Brand lokal yang hadir dengan prinsip: limited, intentional, and community-driven."}
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <Card variant="glass" className="p-6 md:p-8">
            <p className="text-gray-200 text-base md:text-lg leading-relaxed">
              {aboutSettings.aboutcontent ||
                "Kami percaya, pakaian terbaik bukan yang paling banyak diproduksi — tapi yang paling bermakna. Karena itu, setiap koleksi dirilis dalam sistem pre-order eksklusif."}
            </p>
            <p className="mt-4 text-gray-300 text-sm md:text-base">
              ✅ <span className="font-medium">50–100 pcs per desain</span>
              <br />✅{" "}
              <span className="font-medium">
                Tanpa stok — produksi dimulai setelah periode pre-order berakhir
              </span>
              <br />✅{" "}
              <span className="font-medium">
                Desain yang sold out tidak akan pernah diproduksi ulang
              </span>
            </p>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="flex-1"
            />
          ))}
        </div>

        {/* Quote */}
      </Container>
    </Section>
  );
};

AboutSection.displayName = "AboutSection";
