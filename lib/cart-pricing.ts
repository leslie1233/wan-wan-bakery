import type { CartItem } from "./cart";
import type { PromotionTierView } from "./catalog-types";
import { getApplicableTier } from "./promotion-store";
import {
  discountCentsToPoints,
  pointsToDiscountCents,
  type RewardsSettingsView,
} from "./rewards-settings";

export type CartLinePricing = {
  slug: string;
  name: string;
  quantity: number;
  unitCents: number;
  lineSubtotalCents: number;
};

export type CartPricingExtras = {
  isFirstOrder?: boolean;
  referralCodeValid?: boolean;
  loyaltyPointsAvailable?: number;
  pointsToRedeem?: number;
  rewardsSettings?: RewardsSettingsView | null;
};

export type CartPricing = {
  lines: CartLinePricing[];
  totalQuantity: number;
  subtotalCents: number;
  bulkDiscountPercent: number;
  bulkDiscountCents: number;
  firstOrderDiscountPercent: number;
  firstOrderDiscountCents: number;
  referralDiscountPercent: number;
  referralDiscountCents: number;
  pointsRedeemed: number;
  pointsRedeemedCents: number;
  totalCents: number;
  pointsEarned: number;
  tierLabel: string | null;
  hasPricedItems: boolean;
  /** @deprecated use bulkDiscountPercent */
  discountPercent: number;
  /** @deprecated use bulkDiscountCents */
  discountCents: number;
};

export function calculateCartPricing(
  items: CartItem[],
  tiers: PromotionTierView[],
  promotionActive = true,
  extras: CartPricingExtras = {}
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

  const bulkDiscountPercent = tier?.discountPercent ?? 0;
  const bulkDiscountCents = Math.round((subtotalCents * bulkDiscountPercent) / 100);
  let remainingCents = subtotalCents - bulkDiscountCents;

  const rewards = extras.rewardsSettings;
  const rewardsActive = rewards?.active ?? false;

  let firstOrderDiscountPercent = 0;
  let firstOrderDiscountCents = 0;
  let referralDiscountPercent = 0;
  let referralDiscountCents = 0;

  if (rewardsActive && rewards && remainingCents > 0) {
    if (extras.referralCodeValid && rewards.referralDiscountPercent > 0) {
      referralDiscountPercent = rewards.referralDiscountPercent;
      referralDiscountCents = Math.round(
        (remainingCents * referralDiscountPercent) / 100
      );
      remainingCents -= referralDiscountCents;
    } else if (extras.isFirstOrder && rewards.firstOrderDiscountPercent > 0) {
      firstOrderDiscountPercent = rewards.firstOrderDiscountPercent;
      firstOrderDiscountCents = Math.round(
        (remainingCents * firstOrderDiscountPercent) / 100
      );
      remainingCents -= firstOrderDiscountCents;
    }
  }

  let pointsRedeemed = 0;
  let pointsRedeemedCents = 0;

  if (
    rewardsActive &&
    rewards &&
    extras.pointsToRedeem &&
    extras.pointsToRedeem > 0 &&
    extras.loyaltyPointsAvailable &&
    extras.loyaltyPointsAvailable > 0
  ) {
    const maxRedeemablePoints = Math.min(
      extras.pointsToRedeem,
      extras.loyaltyPointsAvailable
    );
    const requestedDiscountCents = pointsToDiscountCents(maxRedeemablePoints, rewards);
    pointsRedeemedCents = Math.min(requestedDiscountCents, remainingCents);
    pointsRedeemed = discountCentsToPoints(pointsRedeemedCents, rewards);
    remainingCents -= pointsRedeemedCents;
  }

  const totalCents = Math.max(0, remainingCents);
  const pointsEarned =
    rewardsActive && rewards
      ? Math.floor(totalCents / 100) * rewards.pointsPerDollar
      : 0;

  return {
    lines,
    totalQuantity,
    subtotalCents,
    bulkDiscountPercent,
    bulkDiscountCents,
    firstOrderDiscountPercent,
    firstOrderDiscountCents,
    referralDiscountPercent,
    referralDiscountCents,
    pointsRedeemed,
    pointsRedeemedCents,
    totalCents,
    pointsEarned,
    tierLabel: tier?.label ?? null,
    hasPricedItems,
    discountPercent: bulkDiscountPercent,
    discountCents: bulkDiscountCents,
  };
}
