import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../../lib/i18n/locales";
import { localePath } from "../../../lib/i18n/paths";
import { createPageMetadata } from "../../../lib/metadata";
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return createPageMetadata({
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
    path: "/about",
    locale,
  });
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <main className="container section page-main content-page">
      <h1>{dict.about.title}</h1>
      <p>{dict.about.paragraph1}</p>
      <p>{dict.about.paragraph2}</p>

      <h2>{dict.about.howItWorks}</h2>
      <ol className="list ordered-list">
        <li>{dict.about.step1}</li>
        <li>{dict.about.step2}</li>
        <li>{dict.about.step3}</li>
        <li>{dict.about.step4}</li>
      </ol>

      <div className="cta">
        <Link className="button" href={localePath(locale, "/products")}>
          {dict.about.viewProducts}
        </Link>
        <Link className="button secondary" href={localePath(locale, "/contact")}>
          {dict.about.contactUs}
        </Link>
      </div>
    </main>
  );
}
