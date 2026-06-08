import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function databaseNameFromUrl(url) {
  if (!url) return "unknown";
  try {
    return new URL(url.replace(/^postgresql:/, "postgres:")).pathname.slice(1) || "unknown";
  } catch {
    return "unknown";
  }
}

async function main() {
  const dbName = databaseNameFromUrl(process.env.DATABASE_URL);
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;

  console.log(`DATABASE NAME: ${dbName}`);
  console.log("SCHEMA: public");
  console.log("HOST: ep-muddy-art-aoazbi7c (Neon, Singapore)");
  console.log("\nTABLES:");
  for (const row of tables) {
    console.log(`  - ${row.table_name}`);
  }

  const [
    users,
    products,
    translations,
    promotions,
    promoTranslations,
    tiers,
    tierTranslations,
    siteSettings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.productTranslation.count(),
    prisma.promotionSettings.count(),
    prisma.promotionTranslation.count(),
    prisma.promotionTier.count(),
    prisma.promotionTierTranslation.count(),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  console.log("\nROW COUNTS:");
  console.log(`  User: ${users}`);
  console.log(`  Product: ${products}`);
  console.log(`  ProductTranslation: ${translations}`);
  console.log(`  PromotionSettings: ${promotions}`);
  console.log(`  PromotionTranslation: ${promoTranslations}`);
  console.log(`  PromotionTier: ${tiers}`);
  console.log(`  PromotionTierTranslation: ${tierTranslations}`);
  console.log(`  SiteSettings: ${siteSettings ? 1 : 0}`);

  if (siteSettings) {
    console.log("\nCURRENT PHONE (SiteSettings):");
    console.log(`  Display: ${siteSettings.phone}`);
    console.log(`  Call: ${siteSettings.phoneE164}`);
    console.log(`  WhatsApp: ${siteSettings.whatsappNumber}`);
  }

  const productList = await prisma.product.findMany({
    select: { slug: true, published: true },
    orderBy: { sortOrder: "asc" },
  });

  console.log("\nPRODUCTS:");
  for (const product of productList) {
    console.log(
      `  - ${product.slug} (${product.published ? "published" : "draft"})`
    );
  }
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
