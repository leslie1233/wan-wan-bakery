"use client";

import { useState } from "react";
import { products } from "../data/products";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { productEnquiryMessage } from "../lib/whatsapp-messages";
import type { ProductSlug } from "../lib/i18n/types";
import { trackEvent } from "./Analytics";
import { useDictionary } from "./LocaleProvider";

export default function EnquiryForm() {
  const dict = useDictionary();
  const [productSlug, setProductSlug] = useState(products[0]?.slug ?? "");
  const [quantity, setQuantity] = useState("1");
  const [pickupDate, setPickupDate] = useState("");
  const [notes, setNotes] = useState("");

  const selectedProduct =
    products.find((product) => product.slug === productSlug) ?? products[0];
  const productName = selectedProduct
    ? dict.products[selectedProduct.slug as ProductSlug].name
    : "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    const message = productEnquiryMessage(
      dict,
      productName,
      quantity ? Number(quantity) : undefined,
      pickupDate,
      notes
    );

    trackEvent("enquiry_form_submit", {
      item_name: productName,
    });

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          {dict.contact.formProduct}
          <select
            value={productSlug}
            onChange={(event) => setProductSlug(event.target.value)}
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {dict.products[product.slug as ProductSlug].name}
              </option>
            ))}
          </select>
        </label>

        <label>
          {dict.contact.formQuantity}
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <label>
          {dict.contact.formPickupDate}
          <input
            type="date"
            value={pickupDate}
            onChange={(event) => setPickupDate(event.target.value)}
          />
        </label>
      </div>

      <label>
        {dict.contact.formNotes}
        <textarea
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={dict.contact.formNotesPlaceholder}
        />
      </label>

      <button type="submit" className="button">
        {dict.contact.formSubmit}
      </button>
    </form>
  );
}
