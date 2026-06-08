"use client";

import { useEffect, useState } from "react";
import { getCartItemCount } from "../lib/cart";
import type { PromotionView } from "../lib/catalog-types";
import { getApplicableTier } from "../lib/promotion-store";
import { useLocale } from "./LocaleProvider";
import { useCart } from "./CartProvider";

export default function CartPromotionNote() {
  const { items } = useCart();
  const { locale } = useLocale();
  const [promotion, setPromotion] = useState<PromotionView | null>(null);
  const totalQuantity = getCartItemCount(items);

  useEffect(() => {
    fetch(`/api/promotions?locale=${locale}`)
      .then((response) => response.json())
      .then((data) => setPromotion(data.promotion))
      .catch(() => setPromotion(null));
  }, [locale]);

  if (totalQuantity === 0 || !promotion?.active) {
    return null;
  }

  const tier = getApplicableTier(promotion.tiers, totalQuantity);
  const message = tier
    ? `${tier.label} applies to your order.`
    : promotion.cartHint;

  return (
    <p className="promotion-note">
      <strong>{promotion.title}:</strong> {message}
    </p>
  );
}
