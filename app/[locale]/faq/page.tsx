import JsonLd from "../../../components/JsonLd";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../../lib/i18n/locales";
import { createPageMetadata } from "../../../lib/metadata";
import { faqJsonLd } from "../../../lib/structured-data";
import { notFound } from "next/navigation";

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
    title: dict.meta.faqTitle,
    description: dict.meta.faqDescription,
    path: "/faq",
    locale,
  });
}

export default function FaqPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const dict = getDictionary(params.locale as Locale);

  return (
    <main className="container section page-main content-page">
      <JsonLd data={faqJsonLd(dict.faq.items)} />
      <h1>{dict.faq.title}</h1>
      <p className="section-intro">{dict.faq.intro}</p>

      <div className="faq-list">
        {dict.faq.items.map((entry) => (
          <article key={entry.question} className="faq-item">
            <h2>{entry.question}</h2>
            <p>{entry.answer}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
