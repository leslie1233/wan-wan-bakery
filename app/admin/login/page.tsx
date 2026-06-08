import { redirect } from "next/navigation";
import LoginForm from "../../../components/admin/LoginForm";
import { auth } from "../../../lib/auth";
import { isDatabaseConfigured } from "../../../lib/db";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/admin/products");
  }

  const hasEnvLogin = Boolean(
    process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD
  );
  const hasDatabase = isDatabaseConfigured();

  return (
    <section className="admin-page">
      {!hasEnvLogin && !hasDatabase ? (
        <div className="admin-card admin-notice">
          <h2>Admin login is not configured</h2>
          <p>
            Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in your
            environment, or configure <code>DATABASE_URL</code> and run{" "}
            <code>npm run db:push</code> plus <code>npm run db:seed</code>.
          </p>
        </div>
      ) : null}

      {!process.env.AUTH_SECRET ? (
        <div className="admin-card admin-notice">
          <h2>Missing AUTH_SECRET</h2>
          <p>
            Add <code>AUTH_SECRET</code> to <code>.env.local</code> (local) or
            Vercel environment variables, then redeploy.
          </p>
        </div>
      ) : null}

      <LoginForm />
    </section>
  );
}
