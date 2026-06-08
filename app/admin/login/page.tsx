import { redirect } from "next/navigation";
import LoginForm from "../../../components/admin/LoginForm";
import { auth } from "../../../lib/auth";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/admin/products");
  }

  return (
    <section className="admin-page">
      <LoginForm />
    </section>
  );
}
