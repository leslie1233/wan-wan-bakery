"use client";

import { useDictionary } from "./LocaleProvider";

export default function TrustSection() {
  const dict = useDictionary();

  return (
    <section className="container section trust-section">
      <h2>{dict.trust.title}</h2>
      <div className="trust-grid">
        <article className="trust-card">
          <strong>{dict.trust.yearsTitle}</strong>
          <p>{dict.trust.yearsText}</p>
        </article>
        <article className="trust-card">
          <strong>{dict.trust.madeToOrderTitle}</strong>
          <p>{dict.trust.madeToOrderText}</p>
        </article>
        <article className="trust-card">
          <strong>{dict.trust.fastRepliesTitle}</strong>
          <p>{dict.trust.fastRepliesText}</p>
        </article>
      </div>

      <div className="testimonial-grid">
        {dict.trust.testimonials.map((item) => (
          <blockquote key={item.author} className="testimonial-card">
            <p>&ldquo;{item.quote}&rdquo;</p>
            <cite>{item.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
