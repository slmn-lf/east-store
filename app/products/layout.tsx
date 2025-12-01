import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koleksi Produk | East Store - Kaos Eksklusif Indonesia",
  description:
    "Jelajahi koleksi lengkap kaos eksklusif East Store dengan desain original dari seniman lokal. Pre-order kaos limited edition dengan kualitas premium.",
  keywords: [
    "koleksi kaos",
    "kaos preorder",
    "kaos eksklusif",
    "desain kaos",
    "fashion Indonesia",
  ],
  openGraph: {
    title: "Koleksi Produk | East Store",
    description:
      "Kaos eksklusif dengan desain original dari seniman lokal Indonesia",
    type: "website",
    url: "https://eaststore.local/products",
    images: [
      {
        url: "/products-og.png",
        width: 1200,
        height: 630,
        alt: "East Store - Koleksi Produk",
      },
    ],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
