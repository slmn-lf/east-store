import type { Metadata, Viewport } from "next";
import { Navbar } from "@/app/components/layout/Navbar";
import { Footer } from "@/app/components/layout/Footer";
import "./globals.css";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  metadataBase: new URL("https://eaststore.local"),
  title: "East Store - Wear Art, Not Just Clothes | Fashion Brand Indonesia",
  description:
    "East Store - Platform e-commerce kaos eksklusif dengan desain original dari seniman lokal. Pre-order system untuk menjaga kualitas dan eksklusivitas setiap koleksi.",
  keywords: [
    "kaos eksklusif",
    "fashion Indonesia",
    "preorder kaos",
    "kaos original",
    "seniman lokal",
    "desain custom",
    "limited edition",
  ],
  authors: [{ name: "East Store Team" }],
  creator: "East Store",
  publisher: "East Store",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://eaststore.local",
    siteName: "East Store",
    title: "East Store - Wear Art, Not Just Clothes",
    description:
      "Platform e-commerce kaos eksklusif dengan desain original dari seniman lokal. Sistem pre-order untuk koleksi yang unik dan limited edition.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "East Store - Fashion Brand Indonesia",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "East Store - Wear Art, Not Just Clothes",
    description:
      "Kaos eksklusif dengan desain original dari seniman lokal Indonesia",
    images: ["/twitter-image.png"],
    creator: "@eaststore",
  },
  alternates: {
    canonical: "https://eaststore.local",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Additional SEO Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="id_ID" />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "East Store",
              url: "https://eaststore.local",
              logo: "https://eaststore.local/logo.png",
              description:
                "Platform e-commerce kaos eksklusif dengan desain original dari seniman lokal",
              sameAs: [
                "https://instagram.com/eaststore",
                "https://facebook.com/eaststore",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                telephone: "+62-xxx-xxxx",
                email: "support@eaststore.local",
              },
            }),
          }}
        />

        {/* Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ECommerce",
              name: "East Store",
              description: "Platform pre-order kaos eksklusif Indonesia",
              url: "https://eaststore.local",
            }),
          }}
        />
      </head>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
