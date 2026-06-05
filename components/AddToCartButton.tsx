"use client";

import { useState } from "react";
import type { Product } from "../data/products";
import type { ProductSlug } from "../lib/i18n/types";
import { useDictionary } from "./LocaleProvider";
import { useCart } from "./CartProvider";
import { trackEvent } from "./Analytics";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const dict = useDictionary();
  const translation = dict.products[product.slug as ProductSlug];
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="button"
      onClick={() => {
        addItem({
          slug: product.slug,
          name: translation.name,
          priceCents: product.priceCents,
        });
        trackEvent("add_to_cart", {
          item_name: translation.name,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? dict.cart.addedToCart : dict.cart.addToCart}
    </button>
  );
}
