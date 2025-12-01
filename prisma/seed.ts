import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

async function main() {
  // Create default size card templates with size rows
  const templatesData = [
    {
      name: "T-Shirt",
      description: "Ukuran standar T-Shirt",
      rows: [
        {
          size: "XS",
          panjang: 63,
          lebarDada: 45,
          lebarBahu: 38,
          panjangLengan: 18,
        },
        {
          size: "S",
          panjang: 66,
          lebarDada: 50,
          lebarBahu: 41,
          panjangLengan: 19,
        },
        {
          size: "M",
          panjang: 69,
          lebarDada: 55,
          lebarBahu: 44,
          panjangLengan: 20,
        },
        {
          size: "L",
          panjang: 72,
          lebarDada: 60,
          lebarBahu: 47,
          panjangLengan: 21,
        },
        {
          size: "XL",
          panjang: 75,
          lebarDada: 65,
          lebarBahu: 50,
          panjangLengan: 22,
        },
        {
          size: "2XL",
          panjang: 78,
          lebarDada: 70,
          lebarBahu: 53,
          panjangLengan: 23,
        },
      ],
    },
    {
      name: "Hoodie",
      description: "Ukuran standar Hoodie",
      rows: [
        {
          size: "S",
          panjang: 70,
          lebarDada: 53,
          lebarBahu: 44,
          panjangLengan: 60,
        },
        {
          size: "M",
          panjang: 73,
          lebarDada: 58,
          lebarBahu: 47,
          panjangLengan: 63,
        },
        {
          size: "L",
          panjang: 76,
          lebarDada: 63,
          lebarBahu: 50,
          panjangLengan: 66,
        },
        {
          size: "XL",
          panjang: 79,
          lebarDada: 68,
          lebarBahu: 53,
          panjangLengan: 69,
        },
      ],
    },
    {
      name: "Celana Panjang",
      description: "Ukuran standar Celana Panjang",
      rows: [
        {
          size: "S",
          panjang: 90,
          lebarDada: 32,
          lebarBahu: 40,
          panjangLengan: 78,
        },
        {
          size: "M",
          panjang: 94,
          lebarDada: 35,
          lebarBahu: 42,
          panjangLengan: 82,
        },
        {
          size: "L",
          panjang: 98,
          lebarDada: 38,
          lebarBahu: 44,
          panjangLengan: 86,
        },
        {
          size: "XL",
          panjang: 102,
          lebarDada: 41,
          lebarBahu: 46,
          panjangLengan: 90,
        },
      ],
    },
    {
      name: "Kemeja",
      description: "Ukuran standar Kemeja",
      rows: [
        {
          size: "S",
          panjang: 68,
          lebarDada: 48,
          lebarBahu: 40,
          panjangLengan: 58,
        },
        {
          size: "M",
          panjang: 71,
          lebarDada: 53,
          lebarBahu: 43,
          panjangLengan: 61,
        },
        {
          size: "L",
          panjang: 74,
          lebarDada: 58,
          lebarBahu: 46,
          panjangLengan: 64,
        },
        {
          size: "XL",
          panjang: 77,
          lebarDada: 63,
          lebarBahu: 49,
          panjangLengan: 67,
        },
      ],
    },
    {
      name: "Jaket",
      description: "Ukuran standar Jaket",
      rows: [
        {
          size: "S",
          panjang: 62,
          lebarDada: 51,
          lebarBahu: 42,
          panjangLengan: 59,
        },
        {
          size: "M",
          panjang: 65,
          lebarDada: 56,
          lebarBahu: 45,
          panjangLengan: 62,
        },
        {
          size: "L",
          panjang: 68,
          lebarDada: 61,
          lebarBahu: 48,
          panjangLengan: 65,
        },
        {
          size: "XL",
          panjang: 71,
          lebarDada: 66,
          lebarBahu: 51,
          panjangLengan: 68,
        },
      ],
    },
  ];

  for (const templateData of templatesData) {
    const { rows, ...templateInput } = templateData;

    await prisma.sizeCardTemplate.upsert({
      where: { name: templateInput.name },
      update: templateInput,
      create: {
        ...templateInput,
        rows: {
          create: rows,
        },
      },
    });
  }

  console.log("✅ Size card templates dengan rows seeded successfully");

  // Create or update admin user
  const adminUser = await prisma.adminUser.upsert({
    where: { email: "admin@eaststore.local" },
    update: {},
    create: {
      email: "admin@eaststore.local",
      password_hash: "demo_password",
      name: "Admin User",
      wa_store: "62812345678",
      role: "admin",
    },
  });

  console.log("✅ Admin user seeded successfully");

  // Get the T-Shirt template
  const tShirtTemplate = await prisma.sizeCardTemplate.findUnique({
    where: { name: "T-Shirt" },
  });

  // Create sample products
  const productsData = [
    {
      title: "Premium Cotton T-Shirt",
      description:
        "Kaos premium dari bahan cotton 24s berkualitas tinggi dengan finishing terbaik",
      price_idr: 125000,
      status: "pre_order" as const,
      wa_store: "62812345678",
    },
    {
      title: "Vintage Graphic Tee",
      description:
        "Kaos dengan desain grafis vintage yang trendy dan nyaman dipakai",
      price_idr: 145000,
      status: "pre_order" as const,
      wa_store: "62812345678",
    },
    {
      title: "Classic White T-Shirt",
      description: "Kaos putih klasik yang cocok untuk segala acara",
      price_idr: 99000,
      status: "pre_order" as const,
      wa_store: "62812345678",
    },
    {
      title: "Urban Streetwear Collection",
      description:
        "Koleksi kaos dengan desain urban streetwear yang fresh dan modern",
      price_idr: 165000,
      status: "coming_soon" as const,
      wa_store: "62812345678",
    },
  ];

  for (const productData of productsData) {
    const slug = generateSlug(productData.title);

    await prisma.product.upsert({
      where: { slug },
      update: productData,
      create: {
        ...productData,
        slug,
        user_id: adminUser.id,
        size_card_template_id: tShirtTemplate?.id || null,
      },
    });
  }

  console.log("✅ Sample products seeded successfully");

  // Seed artworks
  const artworksData = [
    {
      title: "Urban Chaos",
      artist: "Rizky Art",
      image_url: "/artwork-placeholder.svg",
      description:
        "Sebuah representasi visual dari kekacauan urban modern dengan warna-warna berani dan stroke yang ekspresif.",
    },
    {
      title: "Nature's Breath",
      artist: "Sarah Design",
      image_url: "/artwork-placeholder.svg",
      description:
        "Menampilkan keindahan alam dengan palet warna yang lembut dan organik, mencerminkan ketenangan dan harmoni.",
    },
    {
      title: "Future Vision",
      artist: "Tech Creative",
      image_url: "/artwork-placeholder.svg",
      description:
        "Sebuah karya futuristik yang menggabungkan elemen teknologi dengan imajinasi tanpa batas.",
    },
    {
      title: "Traditional Soul",
      artist: "Culture Hub",
      image_url: "/artwork-placeholder.svg",
      description:
        "Menggali kedalaman budaya tradisional dengan sentuhan kontemporer yang memukau.",
    },
    {
      title: "Abstract Emotions",
      artist: "Feel Good",
      image_url: "/artwork-placeholder.svg",
      description:
        "Mengekspresikan emosi manusia melalui bentuk abstrak dan warna yang intens dan dinamis.",
    },
    {
      title: "Geometric Harmony",
      artist: "Shape Master",
      image_url: "/artwork-placeholder.svg",
      description:
        "Keseimbangan sempurna antara bentuk geometris dan ruang negatif menciptakan harmoni visual.",
    },
  ];

  // Clear existing artworks
  await prisma.artwork.deleteMany();

  for (const artworkData of artworksData) {
    await prisma.artwork.create({
      data: artworkData,
    });
  }

  console.log("✅ Sample artworks seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
