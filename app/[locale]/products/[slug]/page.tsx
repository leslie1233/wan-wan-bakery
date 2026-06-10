import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../../components/AddToCartButton";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import FacebookShareLink from "../../../../components/FacebookShareLink";
import JsonLd from "../../../../components/JsonLd";
import PromotionBanner from "../../../../components/PromotionBanner";
import WhatsAppLink from "../../../../components/WhatsAppLink";
import { formatPrice } from "../../../../lib/format";
import {
  getAllProductSlugs,
  getCatalogProduct,
} from "../../../../lib/catalog";
import { getDictionary } from "../../../../lib/i18n/get-dictionary";
import { leadTimeBadges } from "../../../../lib/i18n/lead-time";
import { isLocale, locales, type Locale } from "../../../../lib/i18n/locales";
import { localePath } from "../../../../lib/i18n/paths";
import { createPageMetadata } from "../../../../lib/metadata";
import { getPromotionView } from "../../../../lib/promotion-store";
import { getSiteSettings } from "../../../../lib/site-settings";
import {
  breadcrumbJsonLd,
  productJsonLd,
} from "../../../../lib/structured-data";
import { buildWhatsAppUrl } from "../../../../lib/whatsapp";
import {
  productEnquiryMessage,
  productQuestionMessage,
} from "../../../../lib/whatsapp-messages";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();

  return slugs.flatMap((slug) =>
    locales.map((locale) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const product = await getCatalogProduct(params.slug, locale);

  if (!product) {
    return {
      title: dict.productsPage.notFound,
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `${product.name} Singapore`,
    description: `${product.description} ${leadTimeBadges[locale]}. Order from Wan Wan Bakery Singapore.`,
    path: `/products/${product.slug}`,
    image: product.image,
    locale,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const [product, promotion, contact] = await Promise.all([
    getCatalogProduct(params.slug, locale),
    getPromotionView(locale),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const whatsappOrder = buildWhatsAppUrl(
    productEnquiryMessage(dict, product.name),
    contact.whatsappNumber
  );
  const whatsappQuestion = buildWhatsAppUrl(
    productQuestionMessage(dict, product.name),
    contact.whatsappNumber
  );

  return (
    <main className="container page-main">
      <Breadcrumbs
        items={[
          { label: dict.nav.home, href: localePath(locale, "/") },
          { label: dict.nav.products, href: localePath(locale, "/products") },
          { label: product.name },
        ]}
      />
      <JsonLd data={productJsonLd(product, locale)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: localePath(locale, "/") },
          { name: dict.nav.products, path: localePath(locale, "/products") },
          {
            name: product.name,
            path: localePath(locale, `/products/${product.slug}`),
          },
        ])}
      />

      <PromotionBanner promotion={promotion} />

      <div className="detail">
        <div className="detail-image">
          <Image
            src={product.image}
            alt={product.name}
            width={720}
            height={720}
            className="detail-product-image"
            priority
          />
        </div>

        <div>
          <p className="meta">{product.category}</p>
          <h1>{product.name}</h1>

          {product.priceCents > 0 ? (
            <p className="product-price">
              <strong>{formatPrice(product.priceCents)}</strong>
            </p>
          ) : null}

          <p>{product.description}</p>

          <p>
            <strong>{dict.productsPage.leadTime}</strong> {leadTimeBadges[locale]}
          </p>

          <p className="urgency-note">{dict.productsPage.urgency}</p>

          <h2>{dict.productsPage.highlights}</h2>

          <ul className="list">
            {product.highlights.map((highlight) => (
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
