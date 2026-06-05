export const locales = [
  "en",
  "zh",
  "ko",
  "ja",
  "es",
  "fr",
  "id",
  "ta",
  "ms",
  "fil",
  "th",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
  es: "Español",
  fr: "Français",
  id: "Bahasa Indonesia",
  ta: "தமிழ்",
  ms: "Bahasa Melayu",
  fil: "Filipino",
  th: "ภาษาไทย",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
  ko: "ko",
  ja: "ja",
  es: "es",
  fr: "fr",
  id: "id",
  ta: "ta",
  ms: "ms",
  fil: "fil",
  th: "th",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path: string = "/"): string {
  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
