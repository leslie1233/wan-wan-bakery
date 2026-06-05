import { siteConfig } from "./site-config";

export function buildShareUrl(path: string = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function buildFacebookShareUrl(path: string = "/"): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    buildShareUrl(path)
  )}`;
}
