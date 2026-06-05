"use client";

import { useState } from "react";
import { products } from "../data/products";
import { openWhatsAppInNewTab } from "../lib/open-whatsapp";
import { buildWhatsAppUrl, formEnquiryMessage } from "../lib/whatsapp";
import { trackEvent } from "./Analytics";

export default function EnquiryForm() {
  const [productSlug, setProductSlug] = useState(products[0]?.slug ?? "");
  const [quantity, setQuantity] = useState("1");
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");

  const selectedProduct =
    products.find((product) => product.slug === productSlug) ?? products[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    const message = formEnquiryMessage(
      selectedProduct.name,
      quantity,
      pickupDate,
      notes
    );

    trackEvent("enquiry_form_submit", {
      item_name: selectedProduct.name,
    });

    openWhatsAppInNewTab(buildWhatsAppUrl(message));
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Product
          <select
            value={productSlug}
            onChange={(event) => setProductSlug(event.target.value)}
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <label>
          Preferred pickup date
          <input
            type="date"
            value={pickupDate}
            onChange={(event) => setPickupDate(event.target.value)}
          />
        </label>
      </div>

      <label>
        Notes (size, flavour, occasion)
        <textarea
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="E.g. birthday cake for 8 people, less sweet if possible"
        />
      </label>

      <button type="submit" className="button">
        Send Enquiry on WhatsApp
      </button>
    </form>
  );
}
