import type { CartItem } from "./cart";
import type { PromotionTierView } from "./catalog-types";
import { getApplicableTier } from "./promotion-store";

export type CartLinePricing = {
  slug: string;
  name: string;
  quantity: number;
  unitCents: number;
  lineSubtotalCents: number;
};

export type CartPricing = {
  lines: CartLinePricing[];
  totalQuantity: number;
  subtotalCents: number;
  discountPercent: number;
  discountCents: number;
  totalCents: number;
  tierLabel: string | null;
  hasPricedItems: boolean;
};

export function calculateCartPricing(
  items: CartItem[],
  tiers: PromotionTierView[],
  promotionActive = true
): CartPricing {
  const lines: CartLinePricing[] = items.map((item) => ({
    slug: item.slug,
    name: item.name,
    quantity: item.quantity,
    unitCents: item.priceCents,
    lineSubtotalCents: item.priceCents * item.quantity,
  }));

  const totalQuantity = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotalCents = lines.reduce(
    (total, line) => total + line.lineSubtotalCents,
    0
  );
  const hasPricedItems = lines.some((line) => line.unitCents > 0);

  const tier =
    promotionActive && tiers.length > 0
      ? getApplicableTier(tiers, totalQuantity)
      : null;

  const discountPercent = tier?.discountPercent ?? 0;
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const totalCents = subtotalCents - discountCents;

  return {
    lines,
    totalQuantity,
    subtotalCents,
    discountPercent,
    discountCents,
    totalCents,
    tierLabel: tier?.label ?? null,
    hasPricedItems,
  };
}
