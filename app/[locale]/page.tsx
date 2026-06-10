import Link from "next/link";
import { notFound } from "next/navigation";
import FacebookShareLink from "../../components/FacebookShareLink";
import HeroBanner from "../../components/HeroBanner";
import ProductCard from "../../components/ProductCard";
import PromotionBanner from "../../components/PromotionBanner";
import TrustSection from "../../components/TrustSection";
import WhatsAppLink from "../../components/WhatsAppLink";
import { getCatalogProducts } from "../../lib/catalog";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../lib/i18n/locales";
import { localePath } from "../../lib/i18n/paths";
import { createPageMetadata } from "../../lib/metadata";
import { getPromotionView } from "../../lib/promotion-store";
import { getSiteSettings } from "../../lib/site-settings";
import { siteConfig } from "../../lib/site-config";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import { generalEnquiryMessage } from "../../lib/whatsapp-messages";
import { formatCallLabel } from "../../lib/phone";

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
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    path: "/",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const [products, promotion, contact] = await Promise.all([
    getCatalogProducts(locale),
    getPromotionView(locale),
    getSiteSettings(),
  ]);
  const whatsapp = buildWhatsAppUrl(
    generalEnquiryMessage(dict),
    contact.whatsappNumber
  );

  return (
    <main className="page-main">
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="home-hero-banner-wrap">
            <HeroBanner alt={dict.hero.bannerAlt} />
          </div>
          <div className="home-hero-copy">
            <h1>{dict.hero.tagline}</h1>
            <p>{dict.hero.subtitle}</p>
            <div className="cta home-hero-cta">
              <Link className="button" href="#products">
                {dict.hero.viewMenu}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="container section home-products-section">
        <h2>{dict.home.productsTitle}</h2>
        <p className="section-intro">{dict.home.productsIntro}</p>

        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <PromotionBanner promotion={promotion} standalone />

      <TrustSection />

      <section className="container section home-contact-section">
        <div className="contact-box">
          <h2>{dict.home.orderEnquiryTitle}</h2>
          <p>{dict.home.orderEnquiryText}</p>
          <div className="cta">
            <WhatsAppLink
              href={whatsapp}
              className="button"
              eventLabel="home_enquiry_whatsapp"
            >
              {dict.home.contactBakery}
            </WhatsAppLink>
            <Link className="button secondary" href={localePath(locale, "/cart")}>
              {dict.home.reviewCart}
            </Link>
            <a className="button secondary" href={`tel:${contact.phoneE164}`}>
              {formatCallLabel(dict.hero.call, contact.phone)}
            </a>
            <FacebookShareLink
              path={localePath(locale, "/")}
              className="button facebook"
              eventLabel="home_facebook_share"
            >
              {dict.home.shareFacebook}
            </FacebookShareLink>
          </div>
        </div>
      </section>
    </main>
  );
}
