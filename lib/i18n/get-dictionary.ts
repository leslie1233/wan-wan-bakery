import type { Locale } from "./locales";
import type { Dictionary } from "./types";
import { en } from "./dictionaries/en";
import { zh } from "./dictionaries/zh";
import { ko } from "./dictionaries/ko";
import { ja } from "./dictionaries/ja";
import { es } from "./dictionaries/es";
import { fr } from "./dictionaries/fr";
import { id } from "./dictionaries/id";
import { ta } from "./dictionaries/ta";
import { ms } from "./dictionaries/ms";
import { fil } from "./dictionaries/fil";
import { th } from "./dictionaries/th";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  zh,
  ko,
  ja,
  es,
  fr,
  id,
  ta,
  ms,
  fil,
  th,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
