"use client";

import { useState } from "react";
import type { CatalogProduct } from "../lib/catalog-types";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { productEnquiryMessage } from "../lib/whatsapp-messages";
import { trackEvent } from "./Analytics";
import { useDictionary } from "./LocaleProvider";
import { useSiteSettings } from "./SiteSettingsProvider";

type EnquiryFormProps = {
  products: CatalogProduct[];
};

export default function EnquiryForm({ products }: EnquiryFormProps) {
  const dict = useDictionary();
  const contact = useSiteSettings();
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

    const message = productEnquiryMessage(
      dict,
      selectedProduct.name,
      quantity ? Number(quantity) : undefined,
      pickupDate,
      notes
    );

    trackEvent("enquiry_form_submit", {
      item_name: selectedProduct.name,
    });

    window.open(
      buildWhatsAppUrl(message, contact.whatsappNumber),
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <label>
        {dict.contact.formProduct}
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

      <label>
        {dict.contact.formNotes}
        <textarea
          rows={3}
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
