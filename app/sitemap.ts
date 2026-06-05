import { MetadataRoute } from "next";
import { products } from "../data/products";

const siteUrl = "https://www.wanwanbakery.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date()
    }))
  ];
}
