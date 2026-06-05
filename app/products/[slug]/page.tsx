import { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "../../../data/products";

const emojiMap: Record<string, string> = {
  "garlic-bread": "🥖",
  "pandan-chiffon-cake": "🍰",
  "cheese-cake": "🧀"
};

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) return {};

  return {
    title: `${product.name} | Wan Wan Bakery`,
    description: product.description,
    keywords: [product.name, product.category, "Wan Wan Bakery", "bakery Singapore", "cake enquiry"]
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) notFound();

  const whatsappText = encodeURIComponent(`Hi Wan Wan Bakery, I would like to enquire about ${product.name}.`);
  const whatsapp = `https://wa.me/6593855540?text=${whatsappText}`;

  return (
    <main className="container detail">
      <div className="detail-image">{emojiMap[product.slug] || "🍞"}</div>
      <section>
        <p className="meta">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p><strong>Price:</strong> {product.price}</p>
        <p><strong>Lead time:</strong> {product.leadTime}</p>
        <h2>Highlights</h2>
        <ul className="list">
          {product.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
        <div className="cta">
          <a className="button" href={whatsapp}>Enquire on WhatsApp</a>
          <a className="button secondary" href="/">Back to Catalogue</a>
        </div>
      </section>
    </main>
  );
}
