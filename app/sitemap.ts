import { MetadataRoute } from "next";
import { getAllProductSlugs } from "../lib/catalog";
import { locales, localizedPath } from "../lib/i18n/locales";
import { siteConfig } from "../lib/site-config";

const staticPages = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllProductSlugs();

  return locales.flatMap((locale) => [
    ...staticPages.map((page) => ({
      url: `${siteConfig.url}${localizedPath(locale, page.path)}`,
      lastModified: siteConfig.lastContentUpdate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...slugs.map((slug) => ({
      url: `${siteConfig.url}${localizedPath(locale, `/products/${slug}`)}`,
      lastModified: siteConfig.lastContentUpdate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);
}
