import { siteConfig } from "../lib/site-config";

const testimonials = [
  {
    quote:
      "The pandan chiffon is always soft and fragrant. We order ahead for family gatherings every month.",
    author: "Regular customer, Singapore",
  },
  {
    quote:
      "Garlic bread arrives fresh and crispy. Easy to order on WhatsApp and pickup is smooth.",
    author: "Home baker fan",
  },
  {
    quote:
      "Cheesecake was creamy and not too sweet — perfect for my daughter's birthday.",
    author: "Birthday order",
  },
];

export default function TrustSection() {
  return (
    <section className="container section trust-section">
      <h2>Why customers choose us</h2>
      <div className="trust-grid">
        <article className="trust-card">
          <strong>{siteConfig.yearsBaking}+ years</strong>
          <p>Home-baked favourites made with care in Singapore.</p>
        </article>
        <article className="trust-card">
          <strong>Made to order</strong>
          <p>Limited daily slots — order ahead for weekends and celebrations.</p>
        </article>
        <article className="trust-card">
          <strong>Fast replies</strong>
          <p>We usually respond {siteConfig.replyTime} on WhatsApp.</p>
        </article>
      </div>

      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <blockquote key={item.author} className="testimonial-card">
            <p>&ldquo;{item.quote}&rdquo;</p>
            <cite>{item.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
