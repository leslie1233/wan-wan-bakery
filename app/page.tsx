import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function HomePage() {
  const whatsapp =
    "https://wa.me/6593855540?text=Hi%20Wan%20Wan%20Bakery%2C%20I%20would%20like%20to%20enquire%20about%20your%20bakery%20items.";

  return (
    <main>
      <section className="hero-banner">
        <img src="/images/banner.jpg" alt="Wan Wan Bakery banner" />
      </section>

      <section id="products" className="container section">
        <h2>Our Products</h2>
        <p className="section-intro">
          Freshly baked garlic bread, pandan chiffon cake and cheesecake.
          Contact us to check availability and place an advance order.
        </p>

        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="contact-box">
          <h2>Order Enquiry</h2>
          <p>
            For price, availability, or custom requests, WhatsApp or call{" "}
            <strong>93855540</strong>.
          </p>
          <a className="button" href={whatsapp}>
            Contact Wan Wan Bakery
          </a>
        </div>
      </section>
    </main>
  );
}