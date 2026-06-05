import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import TrustSection from "../components/TrustSection";
import WhatsAppLink from "../components/WhatsAppLink";
import { products } from "../data/products";
import { createPageMetadata } from "../lib/metadata";
import { siteConfig } from "../lib/site-config";
import { buildWhatsAppUrl, generalEnquiryMessage } from "../lib/whatsapp";

export const metadata = createPageMetadata({
  title:
    "Wan Wan Bakery | Garlic Bread, Pandan Chiffon Cake & Cheesecake Singapore",
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const whatsapp = buildWhatsAppUrl(generalEnquiryMessage());

  return (
    <main className="page-main">
      <section className="hero-banner">
        <Image
          src="/images/banner.jpg"
          alt="Wan Wan Bakery banner"
          width={1600}
          height={900}
          priority
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>{siteConfig.tagline}</h1>
            <p>
              Freshly baked garlic bread, pandan chiffon cake and cheesecake.
              Order ahead for weekends and celebrations.
            </p>
            <div className="cta hero-cta">
              <WhatsAppLink
                href={whatsapp}
                className="button"
                eventLabel="hero_whatsapp"
              >
                Order on WhatsApp
              </WhatsAppLink>
              <Link className="button secondary" href="/products">
                View Menu
              </Link>
              <a className="button secondary" href={`tel:${siteConfig.phoneE164}`}>
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="container section">
        <h2>Our Products</h2>
        <p className="section-intro">
          Contact us to confirm price, size, availability, and pickup time.
          Limited slots daily — please order 1–3 days in advance for all items.
        </p>

        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <TrustSection />

      <section className="container section">
        <div className="contact-box">
          <h2>Order Enquiry</h2>
          <p>
            For price, availability, or custom requests, WhatsApp or call{" "}
            <strong>{siteConfig.phone}</strong>. Most customers hear back{" "}
            {siteConfig.replyTime}.
          </p>
          <div className="cta">
            <WhatsAppLink
              href={whatsapp}
              className="button"
              eventLabel="home_enquiry_whatsapp"
            >
              Contact Wan Wan Bakery
            </WhatsAppLink>
            <Link className="button secondary" href="/cart">
              Review Cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
