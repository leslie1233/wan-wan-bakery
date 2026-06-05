import Image from "next/image";
import Link from "next/link";
import type { Product } from "../data/products";
import { buildWhatsAppUrl, productEnquiryMessage } from "../lib/whatsapp";
import WhatsAppLink from "./WhatsAppLink";

export default function ProductCard({ product }: { product: Product }) {
  const whatsapp = buildWhatsAppUrl(productEnquiryMessage(product.name));

  return (
    <article className="card">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <Image
          className="product-photo"
          src={product.image}
          alt={product.name}
          width={400}
          height={260}
        />

        <div className="card-content">
          <p className="meta">{product.category}</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="price-line">
            <strong>{product.price}</strong>
            <span className="badge">{product.leadTime}</span>
          </p>
        </div>
      </Link>

      <div className="card-actions">
        <Link className="button secondary" href={`/products/${product.slug}`}>
          View Details
        </Link>
        <WhatsAppLink
          href={whatsapp}
          className="button"
          eventLabel={`card_whatsapp_${product.slug}`}
        >
          Order via WhatsApp
        </WhatsAppLink>
      </div>
    </article>
  );
}
