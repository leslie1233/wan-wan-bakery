import { MetadataRoute } from "next";
import { products } from "../data/products";
import { locales, localizedPath } from "../lib/i18n/locales";
import { siteConfig } from "../lib/site-config";

const staticPages = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    ...staticPages.map((page) => ({
      url: `${siteConfig.url}${localizedPath(locale, page.path)}`,
      lastModified: siteConfig.lastContentUpdate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}${localizedPath(locale, `/products/${product.slug}`)}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);
}
