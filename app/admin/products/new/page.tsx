import { redirect } from "next/navigation";
import ProductForm from "../../../../components/admin/ProductForm";
import { auth } from "../../../../lib/auth";
import { isDatabaseConfigured } from "../../../../lib/db";

export default async function AdminNewProductPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  if (!isDatabaseConfigured()) {
    redirect("/admin/products");
  }

  return (
    <section className="admin-page">
      <ProductForm mode="create" />
    </section>
  );
}
