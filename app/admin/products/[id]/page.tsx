import { notFound, redirect } from "next/navigation";
import ProductForm from "../../../../components/admin/ProductForm";
import { auth } from "../../../../lib/auth";
import { getAdminProductById, parseHighlights } from "../../../../lib/catalog";
import { isDatabaseConfigured } from "../../../../lib/db";
import { locales } from "../../../../lib/i18n/locales";

export default async function AdminEditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  if (!isDatabaseConfigured()) {
    redirect("/admin/products");
  }

  const product = await getAdminProductById(params.id);

  if (!product) {
    notFound();
  }

  const translations = locales.map((locale) => {
    const existing = product.translations.find((item) => item.locale === locale);

    return {
      locale,
      name: existing?.name ?? "",
      category: existing?.category ?? "",
      description: existing?.description ?? "",
      highlights: existing ? parseHighlights(existing.highlights).join(", ") : "",
    };
  });

  return (
    <section className="admin-page">
      <ProductForm
        mode="edit"
        productId={product.id}
        initialValues={{
          slug: product.slug,
          image: product.image,
          priceCents: product.priceCents,
          published: product.published,
          sortOrder: product.sortOrder,
          translations,
        }}
      />
    </section>
  );
}
