"use client";

import type { CartPricing } from "../lib/cart-pricing";
import type { PromotionView } from "../lib/catalog-types";
import { formatPrice } from "../lib/format";
import { getApplicableTier } from "../lib/promotion-store";
import { useDictionary } from "./LocaleProvider";

type CartPromotionNoteProps = {
  promotion: PromotionView | null;
  pricing: CartPricing;
};

export default function CartPromotionNote({
  promotion,
  pricing,
}: CartPromotionNoteProps) {
  const dict = useDictionary();

  if (pricing.totalQuantity === 0 || !promotion?.active) {
    return null;
  }

  const tier = getApplicableTier(promotion.tiers, pricing.totalQuantity);
  const message = tier
    ? dict.promotion.cartQualified.replace("{{label}}", tier.label)
    : promotion.cartHint;

  return (
    <p className="promotion-note">
      <strong>{promotion.title}:</strong> {message}
      {pricing.bulkDiscountCents > 0 ? (
        <>
          {" "}
          ({dict.cart.discount}: -{formatPrice(pricing.bulkDiscountCents)})
        </>
      ) : null}
    </p>
  );
}
