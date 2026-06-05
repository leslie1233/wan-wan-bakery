import type { Metadata } from "next";
import { localizedPath, type Locale } from "./i18n/locales";
import { siteConfig } from "./site-config";

export function createPageMetadata({
  title,
  description,
  path = "/",
  image = "/images/banner.jpg",
  locale = "en",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  locale?: Locale;
}): Metadata {
  const localized = localizedPath(locale, path);
  const url = `${siteConfig.url}${localized}`;

  return {
    title,
    description,
    alternates: {
      canonical: localized,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
