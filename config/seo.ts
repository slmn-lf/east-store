/**
 * SEO Configuration untuk East Store
 * Berisi konfigurasi global untuk search engine optimization
 */

export const SEO_CONFIG = {
  // Domain
  domain: "eaststore.local",
  protocol: "https",
  baseUrl: "https://eaststore.local",

  // Brand
  brandName: "East Store",
  brandTagline: "Wear Art, Not Just Clothes",
  brandDescription:
    "Platform e-commerce kaos eksklusif dengan desain original dari seniman lokal Indonesia",

  // Social Media
  social: {
    instagram: "https://instagram.com/eaststore",
    facebook: "https://facebook.com/eaststore",
    twitter: "https://twitter.com/eaststore",
  },

  // Contact
  contact: {
    email: "support@eaststore.local",
    phone: "+62-xxx-xxxx",
    whatsapp: "6281234567890",
  },

  // SEO Keywords
  keywords: {
    primary: ["kaos eksklusif", "fashion Indonesia", "preorder kaos"],
    secondary: [
      "desain custom",
      "seniman lokal",
      "limited edition",
      "kaos original",
      "e-commerce fashion",
    ],
  },

  // Open Graph
  og: {
    type: "website",
    locale: "id_ID",
    image: {
      url: "https://eaststore.local/og-image.png",
      width: 1200,
      height: 630,
      alt: "East Store - Wear Art, Not Just Clothes",
    },
  },

  // Twitter
  twitter: {
    handle: "@eaststore",
    cardType: "summary_large_image",
  },

  // JSON-LD Schema
  schema: {
    organization: {
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
    },

    ecommerce: {
      "@context": "https://schema.org",
      "@type": "ECommerce",
      name: "East Store",
      description:
        "Platform pre-order kaos eksklusif Indonesia dengan desain original",
      url: "https://eaststore.local",
    },
  },

  // Sitemap
  sitemap: {
    pages: [
      { url: "/", priority: 1.0, changefreq: "weekly" },
      { url: "/products", priority: 0.9, changefreq: "daily" },
      { url: "/artwork", priority: 0.8, changefreq: "weekly" },
      { url: "/contact", priority: 0.5, changefreq: "monthly" },
    ],
  },

  // Robots.txt
  robots: {
    allow: "/",
    disallow: ["/admin", "/api", "/auth/login"],
  },

  // Performance
  performanceMetrics: {
    lighthouse: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 100,
    },
  },

  // Canonical URLs
  canonical: (path = "") => `https://eaststore.local${path}`,

  // Robots Meta Tag
  robotsMeta: "index, follow",

  // Verification Codes
  verification: {
    google: "google-site-verification-code",
    bing: "bing-verification-code",
  },
};

export default SEO_CONFIG;
