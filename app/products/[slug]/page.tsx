import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";
import WhatsAppLink from "../../../components/WhatsAppLink";
import { getProductBySlug, products } from "../../../data/products";
import { createPageMetadata } from "../../../lib/metadata";
import {
  breadcrumbJsonLd,
  productJsonLd,
} from "../../../lib/structured-data";
import { buildWhatsAppUrl, productEnquiryMessage } from "../../../lib/whatsapp";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `${product.name} Singapore`,
    description: `${product.description} ${product.leadTime}. Order from Wan Wan Bakery Singapore.`,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const whatsappOrder = buildWhatsAppUrl(productEnquiryMessage(product.name));
  const whatsappQuestion = buildWhatsAppUrl(
    `Hi Wan Wan Bakery, I have a question about ${product.name}.`
  );

  return (
    <main className="container page-main">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />

      <div className="detail">
      <div className="detail-image">
        <Image
          src={product.image}
          alt={product.name}
          width={720}
          height={720}
          className="detail-product-image"
          priority
        />
      </div>

      <div>
        <p className="meta">{product.category}</p>
        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <p>
          <strong>Lead time:</strong> {product.leadTime}
        </p>

        <p className="urgency-note">
          Limited daily bake slots — please order 1–3 days in advance for all items.
        </p>

        <h2>Highlights</h2>

        <ul className="list">
          {product.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <div className="cta">
          <WhatsAppLink
            href={whatsappOrder}
            className="button"
            eventLabel={`product_order_${product.slug}`}
          >
            Order this on WhatsApp
          </WhatsAppLink>
          <AddToCartButton product={product} />
          <WhatsAppLink
            href={whatsappQuestion}
            className="button secondary"
            eventLabel={`product_question_${product.slug}`}
          >
            Ask a question
          </WhatsAppLink>
          <Link className="button secondary" href="/products">
            Back to Catalogue
          </Link>
        </div>
      </div>
      </div>
    </main>
  );
}
