import JsonLd from "../../components/JsonLd";
import { faqEntries } from "../../data/faq";
import { createPageMetadata } from "../../lib/metadata";
import { faqJsonLd } from "../../lib/structured-data";

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about ordering, pricing, lead times, pickup, and payment at Wan Wan Bakery Singapore.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <main className="container section page-main content-page">
      <JsonLd data={faqJsonLd(faqEntries)} />
      <h1>Frequently Asked Questions</h1>
      <p className="section-intro">
        Quick answers before you place your order. For anything else, WhatsApp us
        anytime.
      </p>

      <div className="faq-list">
        {faqEntries.map((entry) => (
          <article key={entry.question} className="faq-item">
            <h2>{entry.question}</h2>
            <p>{entry.answer}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
