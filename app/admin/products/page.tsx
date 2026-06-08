import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import {
  getAdminProducts,
  getAdminProductsError,
} from "../../../lib/catalog";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const dbError = await getAdminProductsError();
  const products = dbError ? [] : await getAdminProducts();

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Catalog</h2>
          <p>Manage products shown on your multilingual website.</p>
        </div>
        <Link href="/admin/products/new" className="button admin-button">
          Add product
        </Link>
      </div>

      {dbError === "not-configured" ? (
        <div className="admin-card admin-notice">
          <h3>Database not configured</h3>
          <p>
            Create a free Postgres database at{" "}
            <a href="https://neon.tech" target="_blank" rel="noreferrer">
              neon.tech
            </a>
            , then add <code>DATABASE_URL</code> to Vercel environment
            variables and redeploy. From your computer, run{" "}
            <code>npm run db:push</code> and <code>npm run db:seed</code> once
            with the same <code>DATABASE_URL</code>.
          </p>
        </div>
      ) : null}

      {dbError === "connection-failed" ? (
        <div className="admin-card admin-notice">
          <h3>Database connection failed</h3>
          <p>
            Check that <code>DATABASE_URL</code> on Vercel is a valid{" "}
            <code>postgresql://</code> URL, then run{" "}
            <code>npm run db:push</code> and <code>npm run db:seed</code> from
            your computer with the same URL.
          </p>
        </div>
      ) : null}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name (EN)</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const english =
                product.translations.find((item) => item.locale === "en") ??
                product.translations[0];

              return (
                <tr key={product.id}>
                  <td>{english?.name ?? "Untitled"}</td>
                  <td>{product.slug}</td>
                  <td>{product.published ? "Published" : "Draft"}</td>
                  <td>{product.updatedAt.toISOString().slice(0, 10)}</td>
                  <td>
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
