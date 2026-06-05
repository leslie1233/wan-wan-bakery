import { Product } from "../data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <a href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <img className="product-photo" src={product.image} alt={product.name} />

        <div className="card-content">
          <p className="meta">{product.category}</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span className="button secondary">View Details</span>
        </div>
      </a>
    </article>
  );
}