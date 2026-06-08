import { products as staticProducts } from "../data/products";
import type { CatalogProduct } from "./catalog-types";
import { isDatabaseConfigured, prisma } from "./db";
import { getDictionary } from "./i18n/get-dictionary";
import type { Locale } from "./i18n/locales";

function parseHighlights(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // Fall back to comma-separated values.
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringifyHighlights(highlights: string[]): string {
  return JSON.stringify(highlights);
}

export { stringifyHighlights, parseHighlights };

function staticCatalogProduct(
  slug: string,
  locale: Locale
): CatalogProduct | null {
  const product = staticProducts.find((item) => item.slug === slug);

  if (!product) {
    return null;
  }

  const dict = getDictionary(locale);
  const translation = dict.products[slug as keyof typeof dict.products];

  if (!translation) {
    return {
      slug: product.slug,
      name: product.name,
      category: product.category,
      description: product.description,
      priceCents: product.priceCents,
      image: product.image,
      highlights: product.highlights,
      updatedAt: product.updatedAt,
      published: true,
    };
  }

  return {
    slug: product.slug,
    name: translation.name,
    category: translation.category,
    description: translation.description,
    priceCents: product.priceCents,
    image: product.image,
    highlights: translation.highlights,
    updatedAt: product.updatedAt,
    published: true,
  };
}

async function dbCatalogProduct(
  slug: string,
  locale: Locale
): Promise<CatalogProduct | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!product || !product.published) {
    return null;
  }

  const translation =
    product.translations.find((item) => item.locale === locale) ??
    product.translations.find((item) => item.locale === "en") ??
    product.translations[0];

  if (!translation) {
    return null;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: translation.name,
    category: translation.category,
    description: translation.description,
    priceCents: product.priceCents,
    image: product.image,
    highlights: parseHighlights(translation.highlights),
    updatedAt: product.updatedAt.toISOString().slice(0, 10),
    published: product.published,
  };
}

export async function getCatalogProducts(
  locale: Locale,
  options: { includeUnpublished?: boolean } = {}
): Promise<CatalogProduct[]> {
  if (!isDatabaseConfigured()) {
    return staticProducts
      .map((product) => staticCatalogProduct(product.slug, locale))
      .filter((product): product is CatalogProduct => product !== null);
  }

  try {
    const rows = await prisma.product.findMany({
      where: options.includeUnpublished ? undefined : { published: true },
      include: { translations: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (rows.length === 0) {
      return staticProducts
        .map((product) => staticCatalogProduct(product.slug, locale))
        .filter((product): product is CatalogProduct => product !== null);
    }

    const catalogProducts: CatalogProduct[] = [];

    for (const product of rows) {
      const translation =
        product.translations.find((item) => item.locale === locale) ??
        product.translations.find((item) => item.locale === "en") ??
        product.translations[0];

      if (!translation) {
        continue;
      }

      catalogProducts.push({
        id: product.id,
        slug: product.slug,
        name: translation.name,
        category: translation.category,
        description: translation.description,
        priceCents: product.priceCents,
        image: product.image,
        highlights: parseHighlights(translation.highlights),
        updatedAt: product.updatedAt.toISOString().slice(0, 10),
        published: product.published,
      });
    }

    return catalogProducts;
  } catch {
    return staticProducts
      .map((product) => staticCatalogProduct(product.slug, locale))
      .filter((product): product is CatalogProduct => product !== null);
  }
}

export async function getCatalogProduct(
  slug: string,
  locale: Locale
): Promise<CatalogProduct | null> {
  if (!isDatabaseConfigured()) {
    return staticCatalogProduct(slug, locale);
  }

  try {
    const product = await dbCatalogProduct(slug, locale);

    if (product) {
      return product;
    }

    return staticCatalogProduct(slug, locale);
  } catch {
    return staticCatalogProduct(slug, locale);
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!isDatabaseConfigured()) {
    return staticProducts.map((product) => product.slug);
  }

  try {
    const rows = await prisma.product.findMany({
      where: { published: true },
      select: { slug: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (rows.length === 0) {
      return staticProducts.map((product) => product.slug);
    }

    return rows.map((row) => row.slug);
  } catch {
    return staticProducts.map((product) => product.slug);
  }
}

export async function getAdminProducts() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return prisma.product.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAdminProductById(id: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return prisma.product.findUnique({
    where: { id },
    include: { translations: true },
  });
}
