import { NextResponse } from "next/server";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import {
  getAdminProducts,
  parseHighlights,
  stringifyHighlights,
} from "../../../../lib/catalog";
import { isDatabaseConfigured, prisma } from "../../../../lib/db";
import { locales } from "../../../../lib/i18n/locales";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured. Set DATABASE_URL first." },
      { status: 503 }
    );
  }

  const products = await getAdminProducts();

  return NextResponse.json({
    products: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      image: product.image,
      priceCents: product.priceCents,
      published: product.published,
      sortOrder: product.sortOrder,
      updatedAt: product.updatedAt,
      translations: product.translations.map((translation) => ({
        locale: translation.locale,
        name: translation.name,
        category: translation.category,
        description: translation.description,
        highlights: parseHighlights(translation.highlights),
      })),
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured. Set DATABASE_URL first." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const slug = slugify(body.slug ?? body.name ?? "");
  const image = String(body.image ?? "/images/placeholder.jpg");
  const priceCents = Number(body.priceCents ?? 0);
  const published = Boolean(body.published ?? true);
  const sortOrder = Number(body.sortOrder ?? 0);
  const translations = Array.isArray(body.translations) ? body.translations : [];

  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });

  if (existing) {
    return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      slug,
      image,
      priceCents,
      published,
      sortOrder,
      translations: {
        create: translations.map(
          (translation: {
            locale: string;
            name: string;
            category: string;
            description: string;
            highlights: string[];
          }) => ({
            locale: translation.locale,
            name: translation.name,
            category: translation.category,
            description: translation.description,
            highlights: stringifyHighlights(translation.highlights ?? []),
          })
        ),
      },
    },
    include: { translations: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}

export async function OPTIONS() {
  return NextResponse.json({ locales });
}
