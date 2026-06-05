"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../data/products";
import { leadTimeBadges } from "../lib/i18n/lead-time";
import { localePath } from "../lib/i18n/paths";
import type { ProductSlug } from "../lib/i18n/types";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { productEnquiryMessage } from "../lib/whatsapp-messages";
import { useLocale } from "./LocaleProvider";
import WhatsAppLink from "./WhatsAppLink";

export default function ProductCard({ product }: { product: Product }) {
  const { locale, dict } = useLocale();
  const translation = dict.products[product.slug as ProductSlug];
  const whatsapp = buildWhatsAppUrl(
    productEnquiryMessage(dict, translation.name)
  );

  return (
    <article className="card">
      <Link
        href={localePath(locale, `/products/${product.slug}`)}
        aria-label={`View ${translation.name}`}
      >
        <Image
          className="product-photo"
          src={product.image}
          alt={translation.name}
          width={400}
          height={260}
        />

        <div className="card-content">
          <p className="meta">{translation.category}</p>
          <h3>{translation.name}</h3>
          <p>{translation.description}</p>
          <p className="price-line">
            <span className="badge">{leadTimeBadges[locale]}</span>
          </p>
        </div>
      </Link>

      <div className="card-actions">
        <Link
          className="button secondary"
          href={localePath(locale, `/products/${product.slug}`)}
        >
          {dict.productsPage.viewDetails}
        </Link>
        <WhatsAppLink
          href={whatsapp}
          className="button"
          eventLabel={`card_whatsapp_${product.slug}`}
        >
          {dict.productsPage.orderWhatsApp}
        </WhatsAppLink>
      </div>
    </article>
  );
}
