import type { CatalogProduct } from "./catalog-types";
import { localizedPath, type Locale } from "./i18n/locales";
import type { SiteContactSettings } from "./phone";
import { getInstagramUrl } from "./social";
import { siteConfig } from "./site-config";

export function localBusinessJsonLd(settings?: SiteContactSettings) {
  const contact = settings ?? {
    phone: siteConfig.phone,
    phoneE164: siteConfig.phoneE164,
    whatsappNumber: siteConfig.whatsappNumber,
  };

  const instagramUrl = getInstagramUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: contact.phoneE164,
    ...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
    image: `${siteConfig.url}/images/logo.jpg`,
    servesCuisine: "Bakery",
    areaServed: {
      "@type": "Country",
      name: "Singapore",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    hasMenu: `${siteConfig.url}/products`,
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://wa.me/${contact.whatsappNumber}`,
        actionPlatform: [
          "http://schema.org/MobileWebPlatform",
          "http://schema.org/DesktopWebPlatform",
        ],
      },
      deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModePickUp",
    },
  };
}

export function productJsonLd(product: CatalogProduct, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${siteConfig.url}${product.image}`,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      url: `${siteConfig.url}${localizedPath(locale, `/products/${product.slug}`)}`,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function faqJsonLd(
  entries: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function itemListJsonLd(products: CatalogProduct[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} Products`,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}${localizedPath(locale, `/products/${product.slug}`)}`,
      name: product.name,
    })),
  };
}
