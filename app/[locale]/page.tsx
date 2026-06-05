import Link from "next/link";
import FacebookShareLink from "../../components/FacebookShareLink";
import HeroBanner from "../../components/HeroBanner";
import ProductCard from "../../components/ProductCard";
import PromotionBanner from "../../components/PromotionBanner";
import TrustSection from "../../components/TrustSection";
import WhatsAppLink from "../../components/WhatsAppLink";
import { products } from "../../data/products";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../lib/i18n/locales";
import { localePath } from "../../lib/i18n/paths";
import { createPageMetadata } from "../../lib/metadata";
import { siteConfig } from "../../lib/site-config";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import { generalEnquiryMessage } from "../../lib/whatsapp-messages";
import { notFound } from "next/navigation";

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

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const whatsapp = buildWhatsAppUrl(generalEnquiryMessage(dict));

  return (
    <main className="page-main">
      <section className="hero-banner">
        <HeroBanner alt={dict.hero.bannerAlt} />
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>{dict.hero.tagline}</h1>
            <p>{dict.hero.subtitle}</p>
            <div className="cta hero-cta">
              <WhatsAppLink
                href={whatsapp}
                className="button"
                eventLabel="hero_whatsapp"
              >
                {dict.hero.orderWhatsApp}
              </WhatsAppLink>
              <Link className="button secondary" href={localePath(locale, "/products")}>
                {dict.hero.viewMenu}
              </Link>
              <a className="button secondary" href={`tel:${siteConfig.phoneE164}`}>
                {dict.hero.call}
              </a>
            </div>
          </div>
        </div>
      </section>

      <PromotionBanner standalone />

      <section id="products" className="container section">
        <h2>{dict.home.productsTitle}</h2>
        <p className="section-intro">{dict.home.productsIntro}</p>

        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <TrustSection />

      <section className="container section">
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
