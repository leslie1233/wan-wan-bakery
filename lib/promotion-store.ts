import {
  getApplicablePromotion as staticApplicablePromotion,
  getPromotionSummary as staticPromotionSummary,
  promotionTiers as staticPromotionTiers,
  promotionTitle as staticPromotionTitle,
} from "../data/promotions";
import type { PromotionTierView, PromotionView } from "./catalog-types";
import { isDatabaseConfigured, prisma } from "./db";
import { getDictionary } from "./i18n/get-dictionary";
import type { Locale } from "./i18n/locales";

function staticPromotionView(locale: Locale): PromotionView {
  const dict = getDictionary(locale);

  return {
    active: true,
    eyebrow: dict.promotion.eyebrow,
    title: dict.promotion.title,
    intro: dict.promotion.intro,
    cartHint: dict.promotion.cartHint,
    tiers: [
      {
        minQuantity: 5,
        discountPercent: 20,
        label: dict.promotion.tier5,
        sortOrder: 0,
      },
      {
        minQuantity: 10,
        discountPercent: 30,
        label: dict.promotion.tier10,
        sortOrder: 1,
      },
    ],
  };
}

export async function getPromotionView(locale: Locale): Promise<PromotionView> {
  if (!isDatabaseConfigured()) {
    return staticPromotionView(locale);
  }

  try {
    const settings = await prisma.promotionSettings.findUnique({
      where: { id: "default" },
      include: {
        translations: true,
        tiers: {
          include: { translations: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!settings || !settings.active || settings.tiers.length === 0) {
      return staticPromotionView(locale);
    }

    const translation =
      settings.translations.find((item) => item.locale === locale) ??
      settings.translations.find((item) => item.locale === "en") ??
      settings.translations[0];

    const dict = getDictionary(locale);
    const fallback = staticPromotionView(locale);

    return {
      active: settings.active,
      eyebrow: translation?.eyebrow ?? fallback.eyebrow,
      title: translation?.title ?? fallback.title,
      intro: translation?.intro ?? fallback.intro,
      cartHint: translation?.cartHint ?? fallback.cartHint,
      tiers: settings.tiers.map((tier, index) => {
        const tierTranslation =
          tier.translations.find((item) => item.locale === locale) ??
          tier.translations.find((item) => item.locale === "en") ??
          tier.translations[0];

        const staticTier = fallback.tiers[index];

        return {
          id: tier.id,
          minQuantity: tier.minQuantity,
          discountPercent: tier.discountPercent,
          label: tierTranslation?.label ?? staticTier?.label ?? "",
          sortOrder: tier.sortOrder,
        };
      }),
    };
  } catch {
    return staticPromotionView(locale);
  }
}

export function getApplicableTier(
  tiers: PromotionTierView[],
  totalQuantity: number
): PromotionTierView | null {
  const sorted = [...tiers].sort(
    (left, right) => right.minQuantity - left.minQuantity
  );

  return sorted.find((tier) => totalQuantity >= tier.minQuantity) ?? null;
}

export function getPromotionCartMessage(
  promotion: PromotionView,
  totalQuantity: number
): string {
  const tier = getApplicableTier(promotion.tiers, totalQuantity);

  if (tier) {
    return promotion.title
      ? `${promotion.title}: ${tier.label} applies to your order.`
      : `${tier.label} applies to your order.`;
  }

  return `${promotion.title}: ${promotion.cartHint}`;
}

export async function getAdminPromotionSettings() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return prisma.promotionSettings.findUnique({
    where: { id: "default" },
    include: {
      translations: true,
      tiers: {
        include: { translations: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export {
  staticApplicablePromotion,
  staticPromotionSummary,
  staticPromotionTiers,
  staticPromotionTitle,
};
