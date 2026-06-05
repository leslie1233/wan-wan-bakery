import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../../components/AddToCartButton";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import FacebookShareLink from "../../../../components/FacebookShareLink";
import JsonLd from "../../../../components/JsonLd";
import PromotionBanner from "../../../../components/PromotionBanner";
import WhatsAppLink from "../../../../components/WhatsAppLink";
import { getProductBySlug, products } from "../../../../data/products";
import { getDictionary } from "../../../../lib/i18n/get-dictionary";
import { leadTimeBadges } from "../../../../lib/i18n/lead-time";
import { isLocale, type Locale } from "../../../../lib/i18n/locales";
import { localePath } from "../../../../lib/i18n/paths";
import type { ProductSlug } from "../../../../lib/i18n/types";
import { createPageMetadata } from "../../../../lib/metadata";
import {
  breadcrumbJsonLd,
  productJsonLd,
} from "../../../../lib/structured-data";
import { buildWhatsAppUrl } from "../../../../lib/whatsapp";
import {
  productEnquiryMessage,
  productQuestionMessage,
} from "../../../../lib/whatsapp-messages";

export function generateStaticParams() {
  return products.flatMap((product) =>
    ["en", "zh", "ko", "ja", "es", "fr", "id", "ta", "ms", "fil", "th"].map(
      (locale) => ({
        locale,
        slug: product.slug,
      })
    )
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: dict.productsPage.notFound,
      robots: { index: false, follow: false },
    };
  }

  const translation = dict.products[product.slug as ProductSlug];

  return createPageMetadata({
    title: `${translation.name} Singapore`,
    description: `${translation.description} ${leadTimeBadges[locale]}. Order from Wan Wan Bakery Singapore.`,
    path: `/products/${product.slug}`,
    image: product.image,
    locale,
  });
}

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const translation = dict.products[product.slug as ProductSlug];
  const whatsappOrder = buildWhatsAppUrl(
    productEnquiryMessage(dict, translation.name)
  );
  const whatsappQuestion = buildWhatsAppUrl(
    productQuestionMessage(dict, translation.name)
  );

  return (
    <main className="container page-main">
      <Breadcrumbs
        items={[
          { label: dict.nav.home, href: localePath(locale, "/") },
          { label: dict.nav.products, href: localePath(locale, "/products") },
          { label: translation.name },
        ]}
      />
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: localePath(locale, "/") },
          { name: dict.nav.products, path: localePath(locale, "/products") },
          {
            name: translation.name,
            path: localePath(locale, `/products/${product.slug}`),
          },
        ])}
      />

      <PromotionBanner />

      <div className="detail">
        <div className="detail-image">
          <Image
            src={product.image}
            alt={translation.name}
            width={720}
            height={720}
            className="detail-product-image"
            priority
          />
        </div>

        <div>
          <p className="meta">{translation.category}</p>
          <h1>{translation.name}</h1>

          <p>{translation.description}</p>

          <p>
            <strong>{dict.productsPage.leadTime}</strong> {leadTimeBadges[locale]}
          </p>

          <p className="urgency-note">{dict.productsPage.urgency}</p>

          <h2>{dict.productsPage.highlights}</h2>

          <ul className="list">
            {translation.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <div className="cta">
            <WhatsAppLink
              href={whatsappOrder}
              className="button"
              eventLabel={`product_order_${product.slug}`}
            >
              {dict.productsPage.orderThis}
            </WhatsAppLink>
            <AddToCartButton product={product} />
            <WhatsAppLink
              href={whatsappQuestion}
              className="button secondary"
              eventLabel={`product_question_${product.slug}`}
            >
              {dict.productsPage.askQuestion}
            </WhatsAppLink>
            <Link
              className="button secondary"
              href={localePath(locale, "/products")}
            >
              {dict.productsPage.backToCatalogue}
            </Link>
            <FacebookShareLink
              path={localePath(locale, `/products/${product.slug}`)}
              className="button facebook"
              eventLabel={`product_facebook_share_${product.slug}`}
            >
              {dict.productsPage.shareFacebook}
            </FacebookShareLink>
          </div>
        </div>
      </div>
    </main>
  );
}
