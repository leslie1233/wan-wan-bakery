"use client";

import { getCartItemCount } from "../lib/cart";
import { useDictionary } from "./LocaleProvider";
import { useCart } from "./CartProvider";

export default function CartPromotionNote() {
  const { items } = useCart();
  const dict = useDictionary();
  const totalQuantity = getCartItemCount(items);

  if (totalQuantity === 0) {
    return null;
  }

  const promotionLabel =
    totalQuantity >= 10
      ? dict.promotion.tier10
      : totalQuantity >= 5
        ? dict.promotion.tier5
        : null;
  const message = promotionLabel
    ? dict.promotion.cartQualified.replace("{{label}}", promotionLabel)
    : dict.promotion.cartHint;

  return (
    <p className="promotion-note">
      <strong>{dict.promotion.title}:</strong> {message}
    </p>
  );
}
