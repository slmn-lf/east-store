const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateSlug(title) {
  if (!title || typeof title !== "string") return null;
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const products = await prisma.product.findMany({ where: { slug: null } });
  console.log(`Found ${products.length} products without slug`);
  for (const p of products) {
    let base = generateSlug(p.title) || `product-${p.id}`;
    let candidate = base;
    // Ensure uniqueness
    let tries = 0;
    while (true) {
      const exists = await prisma.product.findFirst({
        where: { slug: candidate },
      });
      if (!exists) break;
      tries++;
      candidate = `${base}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      if (tries > 10) {
        candidate = `${base}-${p.id}-${Math.floor(Math.random() * 10000)}`;
        break;
      }
    }
    await prisma.product.update({
      where: { id: p.id },
      data: { slug: candidate },
    });
    console.log(`Updated product ${p.id} -> ${candidate}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
