export const promotionTitle = "Bulk Order Promotion";

export const promotionTiers = [
  {
    minQuantity: 5,
    discountPercent: 20,
    label: "Buy 5, get 20% off",
  },
  {
    minQuantity: 10,
    discountPercent: 30,
    label: "Buy 10, get 30% off",
  },
] as const;

export function getApplicablePromotion(totalQuantity: number) {
  if (totalQuantity >= 10) {
    return promotionTiers[1];
  }

  if (totalQuantity >= 5) {
    return promotionTiers[0];
  }

  return null;
}

export function getPromotionSummary(totalQuantity: number): string {
  const promotion = getApplicablePromotion(totalQuantity);

  if (promotion) {
    return `${promotion.label} applies to your order.`;
  }

  return "Buy 5 items for 20% off, or 10 items for 30% off.";
}
