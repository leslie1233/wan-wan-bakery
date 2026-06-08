import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "../../../../lib/auth-helpers";
import { getAdminPromotionSettings } from "../../../../lib/promotion-store";
import { isDatabaseConfigured, prisma } from "../../../../lib/db";

function revalidatePromotions() {
  revalidatePath("/", "layout");
}

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getAdminPromotionSettings();

  if (!settings) {
    return NextResponse.json(
      { error: "Database is not configured or promotion settings missing." },
      { status: 503 }
    );
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const active = Boolean(body.active ?? true);
  const translations = Array.isArray(body.translations) ? body.translations : [];
  const tiers = Array.isArray(body.tiers) ? body.tiers : [];

  await prisma.promotionSettings.upsert({
    where: { id: "default" },
    update: { active },
    create: { id: "default", active },
  });

  for (const translation of translations) {
    await prisma.promotionTranslation.upsert({
      where: {
        settingsId_locale: {
          settingsId: "default",
          locale: translation.locale,
        },
      },
      update: {
        eyebrow: translation.eyebrow,
        title: translation.title,
        intro: translation.intro,
        cartHint: translation.cartHint,
      },
      create: {
        settingsId: "default",
        locale: translation.locale,
        eyebrow: translation.eyebrow,
        title: translation.title,
        intro: translation.intro,
        cartHint: translation.cartHint,
      },
    });
  }

  await prisma.promotionTier.deleteMany({ where: { settingsId: "default" } });

  for (const [index, tier] of tiers.entries()) {
    const savedTier = await prisma.promotionTier.create({
      data: {
        settingsId: "default",
        minQuantity: Number(tier.minQuantity),
        discountPercent: Number(tier.discountPercent),
        sortOrder: Number(tier.sortOrder ?? index),
      },
    });

    if (Array.isArray(tier.translations)) {
      for (const translation of tier.translations) {
        await prisma.promotionTierTranslation.create({
          data: {
            tierId: savedTier.id,
            locale: translation.locale,
            label: translation.label,
          },
        });
      }
    }
  }

  revalidatePromotions();

  return NextResponse.json({ ok: true });
}
