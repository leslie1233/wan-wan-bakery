import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { getAdminProducts } from "../../../lib/catalog";
import { isDatabaseConfigured } from "../../../lib/db";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const products = isDatabaseConfigured() ? await getAdminProducts() : [];

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

      {!isDatabaseConfigured() ? (
        <div className="admin-card admin-notice">
          <h3>Database not configured</h3>
          <p>
            Add <code>DATABASE_URL</code> to <code>.env.local</code>, run{" "}
            <code>npx prisma db push</code>, then <code>npm run db:seed</code>.
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
