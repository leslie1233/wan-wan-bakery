"use client";

import { usePathname } from "next/navigation";
import {
  localeLabels,
  locales,
  type Locale,
} from "../lib/i18n/locales";
import { useLocale } from "./LocaleProvider";

function replaceLocaleInPath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  segments[1] = locale;
  return segments.join("/") || `/${locale}`;
}

export default function LanguageSwitcher() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();

  return (
    <label className="language-switcher">
      <span className="sr-only">{dict.nav.language}</span>
      <select
        value={locale}
        aria-label={dict.nav.language}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          window.location.href = replaceLocaleInPath(pathname, nextLocale);
        }}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
