import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products } from "../data/products";
import { siteConfig } from "../lib/site-config";
import { getDictionary } from "../lib/i18n/get-dictionary";
import { locales } from "../lib/i18n/locales";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@wanwanbakery.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        image: product.image,
        priceCents: product.priceCents,
        sortOrder: index,
        published: true,
      },
      create: {
        slug: product.slug,
        image: product.image,
        priceCents: product.priceCents,
        sortOrder: index,
        published: true,
      },
    });

    for (const locale of locales) {
      const dict = getDictionary(locale);
      const translation =
        dict.products[product.slug as keyof typeof dict.products];

      if (!translation) {
        continue;
      }

      await prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: savedProduct.id,
            locale,
          },
        },
        update: {
          name: translation.name,
          category: translation.category,
          description: translation.description,
          highlights: JSON.stringify(translation.highlights),
        },
        create: {
          productId: savedProduct.id,
          locale,
          name: translation.name,
          category: translation.category,
          description: translation.description,
          highlights: JSON.stringify(translation.highlights),
        },
      });
    }
  }

  const settings = await prisma.promotionSettings.upsert({
    where: { id: "default" },
    update: { active: true },
    create: { id: "default", active: true },
  });

  for (const locale of locales) {
    const dict = getDictionary(locale);

    await prisma.promotionTranslation.upsert({
      where: {
        settingsId_locale: {
          settingsId: settings.id,
          locale,
        },
      },
      update: {
        eyebrow: dict.promotion.eyebrow,
        title: dict.promotion.title,
        intro: dict.promotion.intro,
        cartHint: dict.promotion.cartHint,
      },
      create: {
        settingsId: settings.id,
        locale,
        eyebrow: dict.promotion.eyebrow,
        title: dict.promotion.title,
        intro: dict.promotion.intro,
        cartHint: dict.promotion.cartHint,
      },
    });
  }

  const tierDefinitions = [
    { minQuantity: 5, discountPercent: 20, sortOrder: 0, key: "tier5" as const },
    { minQuantity: 10, discountPercent: 30, sortOrder: 1, key: "tier10" as const },
  ];

  await prisma.promotionTier.deleteMany({ where: { settingsId: settings.id } });

  for (const tierDefinition of tierDefinitions) {
    const tier = await prisma.promotionTier.create({
      data: {
        settingsId: settings.id,
        minQuantity: tierDefinition.minQuantity,
        discountPercent: tierDefinition.discountPercent,
        sortOrder: tierDefinition.sortOrder,
      },
    });

    for (const locale of locales) {
      const dict = getDictionary(locale);

      await prisma.promotionTierTranslation.create({
        data: {
          tierId: tier.id,
          locale,
          label: dict.promotion[tierDefinition.key],
        },
      });
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      phone: siteConfig.phone,
      phoneE164: siteConfig.phoneE164,
      whatsappNumber: siteConfig.whatsappNumber,
      paynowNumber: siteConfig.phone,
    },
    create: {
      id: "default",
      phone: siteConfig.phone,
      phoneE164: siteConfig.phoneE164,
      whatsappNumber: siteConfig.whatsappNumber,
      paynowNumber: siteConfig.phone,
    },
  });

  console.log(`Seeded admin user: ${adminEmail}`);
  console.log(`Default password: ${adminPassword}`);
  console.log(`Seeded ${products.length} products and promotion settings.`);

  const activeSlugs = products.map((product) => product.slug);
  await prisma.product.updateMany({
    where: { slug: { notIn: activeSlugs } },
    data: { published: false },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
