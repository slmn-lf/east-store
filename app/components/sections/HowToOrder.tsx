import React from "react";
import { Container, Section } from "@/app/components/layout";
import { FeatureCard } from "./FeatureCard";
import { getAllContentSettings } from "@/app/admin/settings/actions";

/**
 * How To Order Section Component
 * Displays the 3-step ordering process with dynamic content from database
 */
export const HowToOrder: React.FC = async () => {
  // Fetch content settings from database
  const settings = await getAllContentSettings();
  const howSettings = settings.howtorder || {};

  // Fallback to defaults if not set
  const title = howSettings.howtitle || "Cara Pesan";
  const description =
    howSettings.howdescription ||
    "Ikuti 3 langkah sederhana untuk mendapatkan kaos edisi terbatas dengan artwork eksklusif.";

  const steps = [
    {
      icon: "1",
      title: howSettings.howstep1title || "Isi Form di Halaman Produk",
      description:
        howSettings.howstep1desc ||
        "Pilih ukuran dan jumlah, lalu lengkapi data diri (nama, alamat, catatan) melalui form di bawah desain kaos.",
    },
    {
      icon: "2",
      title: howSettings.howstep2title || "Kirim via WhatsApp",
      description:
        howSettings.howstep2desc ||
        "Setelah submit, Anda langsung diarahkan ke WhatsApp dengan pesan otomatis berisi detail pesanan.",
    },
    {
      icon: "3",
      title: howSettings.howstep3title || "Pengiriman Serentak",
      description:
        howSettings.howstep3desc ||
        "Semua pesanan diproduksi & dikirim bersamaan sesuai jadwal yang telah ditentukan sejak awal.",
    },
  ];

  return (
    <Section variant="default" spacing="md">
      <Container>
        {/* Header */}
        <div className="text-start mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {title.split("Pesan")[0]}
            <span className="text-amber-400">Pesan</span>
            {title.split("Pesan")[1] || ""}
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl">{description}</p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <FeatureCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              className="flex-1"
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10 text-gray-400 text-sm max-w-2xl mx-auto">
          Dengan melakukan pemesanan, Anda menyetujui kebijakan pre-order kami.
          Terima kasih telah mendukung seni dan karya lokal!
        </div>
      </Container>
    </Section>
  );
};

HowToOrder.displayName = "HowToOrder";
