import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container section page-main content-page">
      <h1>Page not found</h1>
      <p>
        Sorry, we could not find that page. Browse our menu or contact us on
        WhatsApp to place an order.
      </p>
      <div className="cta">
        <Link className="button" href="/products">
          View Products
        </Link>
        <Link className="button secondary" href="/">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
