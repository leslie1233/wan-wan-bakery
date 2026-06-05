"use client";

import { getPromotionSummary } from "../data/promotions";
import { getCartItemCount } from "../lib/cart";
import { useCart } from "./CartProvider";

export default function CartPromotionNote() {
  const { items } = useCart();
  const totalQuantity = getCartItemCount(items);

  if (totalQuantity === 0) {
    return null;
  }

  return (
    <p className="promotion-note">
      <strong>Bulk promotion:</strong> {getPromotionSummary(totalQuantity)}
    </p>
  );
}
