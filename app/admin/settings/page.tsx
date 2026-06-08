import { redirect } from "next/navigation";
import SettingsForm from "../../../components/admin/SettingsForm";
import { auth } from "../../../lib/auth";
import { isDatabaseConfigured } from "../../../lib/db";
import { getSiteSettings } from "../../../lib/site-settings";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <section className="admin-page">
      {!isDatabaseConfigured() ? (
        <div className="admin-card admin-notice">
          <h3>Database not configured</h3>
          <p>
            Phone settings are stored in your database. Add{" "}
            <code>DATABASE_URL</code> on Vercel and redeploy first.
          </p>
        </div>
      ) : null}
      <SettingsForm initialValues={settings} />
    </section>
  );
}
