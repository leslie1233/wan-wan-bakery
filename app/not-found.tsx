import Link from "next/link";
import { defaultLocale } from "../lib/i18n/locales";
import { getDictionary } from "../lib/i18n/get-dictionary";
import { localePath } from "../lib/i18n/paths";

export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <main className="container section page-main content-page">
      <h1>{dict.notFound.title}</h1>
      <p>{dict.notFound.text}</p>
      <div className="cta">
        <Link className="button" href={localePath(defaultLocale, "/products")}>
          {dict.notFound.viewProducts}
        </Link>
        <Link className="button secondary" href={localePath(defaultLocale, "/")}>
          {dict.notFound.backHome}
        </Link>
      </div>
    </main>
  );
}
