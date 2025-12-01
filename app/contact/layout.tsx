import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | East Store - Customer Support",
  description:
    "Hubungi tim East Store untuk pertanyaan, feedback, atau kolaborasi. Kami siap membantu Anda dengan layanan terbaik.",
  keywords: [
    "kontak",
    "support",
    "customer service",
    "kolaborasi",
    "pertanyaan",
  ],
  openGraph: {
    title: "Hubungi Kami | East Store",
    description:
      "Hubungi tim East Store untuk pertanyaan dan dukungan pelanggan",
    type: "website",
    url: "https://eaststore.local/contact",
    images: [
      {
        url: "/contact-og.png",
        width: 1200,
        height: 630,
        alt: "East Store - Hubungi Kami",
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
