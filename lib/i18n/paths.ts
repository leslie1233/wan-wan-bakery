import { localizedPath, type Locale } from "./locales";

export function localePath(locale: Locale, path: string = "/"): string {
  return localizedPath(locale, path);
}
