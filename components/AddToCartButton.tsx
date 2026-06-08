"use client";

import { useState } from "react";
import type { CatalogProduct } from "../lib/catalog-types";
import { useDictionary } from "./LocaleProvider";
import { useCart } from "./CartProvider";
import { trackEvent } from "./Analytics";

export default function AddToCartButton({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const dict = useDictionary();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="button"
      onClick={() => {
        addItem({
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
        });
        trackEvent("add_to_cart", {
          item_name: product.name,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? dict.cart.addedToCart : dict.cart.addToCart}
    </button>
  );
}
