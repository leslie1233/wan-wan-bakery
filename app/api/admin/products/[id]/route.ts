import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "../../../../../lib/auth-helpers";
import {
  getAdminProductById,
  parseHighlights,
  stringifyHighlights,
} from "../../../../../lib/catalog";
import { isDatabaseConfigured, prisma } from "../../../../../lib/db";

function revalidateCatalog() {
  revalidatePath("/", "layout");
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await getAdminProductById(params.id);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...product,
      translations: product.translations.map((translation) => ({
        ...translation,
        highlights: parseHighlights(translation.highlights),
      })),
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      slug: body.slug,
      image: body.image,
      priceCents: Number(body.priceCents ?? 0),
      published: Boolean(body.published),
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });

  if (Array.isArray(body.translations)) {
    for (const translation of body.translations) {
      await prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: params.id,
            locale: translation.locale,
          },
        },
        update: {
          name: translation.name,
          category: translation.category,
          description: translation.description,
          highlights: stringifyHighlights(translation.highlights ?? []),
        },
        create: {
          productId: params.id,
          locale: translation.locale,
          name: translation.name,
          category: translation.category,
          description: translation.description,
          highlights: stringifyHighlights(translation.highlights ?? []),
        },
      });
    }
  }

  revalidateCatalog();

  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  revalidateCatalog();

  return NextResponse.json({ ok: true });
}
