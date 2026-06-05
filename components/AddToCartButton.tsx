"use client";

import { useState } from "react";
import type { Product } from "../data/products";
import { useCart } from "./CartProvider";
import { trackEvent } from "./Analytics";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
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
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
