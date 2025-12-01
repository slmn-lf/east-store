import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Artwork | East Store - Kolaborasi Seniman Lokal",
  description:
    "Lihat kolaborasi eksklusif East Store dengan seniman lokal Indonesia. Setiap kaos adalah kanvas untuk karya seni original yang unik.",
  keywords: [
    "galeri seni",
    "kolaborasi seniman",
    "artwork lokal",
    "desain seni",
    "ilustrasi digital",
  ],
  openGraph: {
    title: "Galeri Artwork | East Store",
    description:
      "Kolaborasi eksklusif dengan seniman lokal Indonesia melalui kaos limited edition",
    type: "website",
    url: "https://eaststore.local/artwork",
    images: [
      {
        url: "/artwork-og.png",
        width: 1200,
        height: 630,
        alt: "East Store - Galeri Artwork",
      },
    ],
  },
};

export default function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
