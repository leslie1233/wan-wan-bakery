import { notFound } from "next/navigation";
import ProductCard from "../../../components/ProductCard";
import PromotionBanner from "../../../components/PromotionBanner";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import { getCatalogProducts } from "../../../lib/catalog";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../../lib/i18n/locales";
import { localePath } from "../../../lib/i18n/paths";
import { createPageMetadata } from "../../../lib/metadata";
import { getPromotionView } from "../../../lib/promotion-store";
import { breadcrumbJsonLd, itemListJsonLd } from "../../../lib/structured-data";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return createPageMetadata({
    title: dict.meta.productsTitle,
    description: dict.meta.productsDescription,
    path: "/products",
    locale,
  });
}

export default async function ProductsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const [products, promotion] = await Promise.all([
    getCatalogProducts(locale),
    getPromotionView(locale),
  ]);

  return (
    <main className="container section page-main">
      <Breadcrumbs
        items={[
          { label: dict.nav.home, href: localePath(locale, "/") },
          { label: dict.nav.products },
        ]}
      />
      <JsonLd data={itemListJsonLd(products, locale)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.nav.home, path: localePath(locale, "/") },
          { name: dict.nav.products, path: localePath(locale, "/products") },
        ])}
      />

      <PromotionBanner promotion={promotion} />

      <h1>{dict.productsPage.title}</h1>
      <p className="section-intro">{dict.productsPage.intro}</p>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
