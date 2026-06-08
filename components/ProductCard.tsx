"use client";

import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "../lib/catalog-types";
import { leadTimeBadges } from "../lib/i18n/lead-time";
import { localePath } from "../lib/i18n/paths";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { productEnquiryMessage } from "../lib/whatsapp-messages";
import { useLocale } from "./LocaleProvider";
import WhatsAppLink from "./WhatsAppLink";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const { locale, dict } = useLocale();
  const whatsapp = buildWhatsAppUrl(
    productEnquiryMessage(dict, product.name)
  );

  return (
    <article className="card">
      <Link
        href={localePath(locale, `/products/${product.slug}`)}
        aria-label={`View ${product.name}`}
      >
        <Image
          className="product-photo"
          src={product.image}
          alt={product.name}
          width={400}
          height={260}
        />

        <div className="card-content">
          <p className="meta">{product.category}</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
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
