import Link from "next/link";
import { createPageMetadata } from "../../lib/metadata";
import { siteConfig } from "../../lib/site-config";

export const metadata = createPageMetadata({
  title: "About Wan Wan Bakery",
  description:
    "Learn about Wan Wan Bakery in Singapore — freshly baked garlic bread, pandan chiffon cake, and cheesecake made to order.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="container section page-main content-page">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a Singapore home bakery known for freshly baked garlic
        bread, fragrant pandan chiffon cake, and creamy cheesecake. Every item is
        made to order with care for family gatherings, celebrations, and everyday
        treats.
      </p>
      <p>
        With more than {siteConfig.yearsBaking} years of baking experience, we focus
        on quality ingredients, reliable lead times, and friendly WhatsApp service.
        Because we bake in limited daily batches, ordering ahead helps us prepare
        your items at their best.
      </p>

      <h2>How ordering works</h2>
      <ol className="list ordered-list">
        <li>Browse our menu and choose your items.</li>
        <li>Send your order on WhatsApp with quantity and pickup date.</li>
        <li>We confirm availability, price, and collection details.</li>
        <li>Pay via {siteConfig.paymentMethods.join(" or ")} when you collect.</li>
      </ol>

      <div className="cta">
        <Link className="button" href="/products">
          View Products
        </Link>
        <Link className="button secondary" href="/contact">
          Contact Us
        </Link>
      </div>
    </main>
  );
}
