import ProductCard from "../../components/ProductCard";
import Breadcrumbs from "../../components/Breadcrumbs";
import JsonLd from "../../components/JsonLd";
import { products } from "../../data/products";
import { createPageMetadata } from "../../lib/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "../../lib/structured-data";

export const metadata = createPageMetadata({
  title: "Bakery Products",
  description:
    "Browse garlic bread, pandan chiffon cake, and cheesecake from Wan Wan Bakery Singapore. Order ahead via WhatsApp.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <main className="container section page-main">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
      />
      <JsonLd data={itemListJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />

      <h1>Our Bakery Menu</h1>
      <p className="section-intro">
        All items are made to order. Prices are starting prices and may vary by
        size or customization.
      </p>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
