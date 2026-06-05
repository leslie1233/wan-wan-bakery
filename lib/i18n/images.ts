import type { Locale } from "./locales";

const LOGO_IMAGE = "/images/logo.jpg";
const DEFAULT_BANNER = "/images/banner.jpg";

export function getLogoImage(): string {
  return LOGO_IMAGE;
}

export function getBannerImage(locale: Locale): string {
  return `/images/banners/${locale}.jpg`;
}

export function getBannerFallback(): string {
  return DEFAULT_BANNER;
}
