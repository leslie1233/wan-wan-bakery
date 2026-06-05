import { products } from "../../../data/products";

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
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    return {
      title: "Product Not Found | Wan Wan Bakery",
    };
  }

  return {
    title: `${product.name} | Wan Wan Bakery Singapore`,
    description: product.description,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    return (
      <main className="container section">
        <h1>Product not found</h1>
        <a className="button" href="/">
          Back to Home
        </a>
      </main>
    );
  }

  const whatsapp = `https://wa.me/6593855540?text=Hi%20Wan%20Wan%20Bakery%2C%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(
    product.name
  )}.`;

  return (
    <main className="container detail">
      <div className="detail-image">
        <img
          src={product.image}
          alt={product.name}
          className="detail-product-image"
        />
      </div>

      <div>
        <p className="meta">{product.category}</p>
        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <p>
          <strong>Price:</strong> {product.price}
        </p>

        <p>
          <strong>Lead time:</strong> {product.leadTime}
        </p>

        <h2>Highlights</h2>

        <ul className="list">
          {product.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <div className="cta">
          <a className="button" href={whatsapp}>
            Enquire on WhatsApp
          </a>

          <a className="button secondary" href="/#products">
            Back to Catalogue
          </a>
        </div>
      </div>
    </main>
  );
}