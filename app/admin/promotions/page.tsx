import { redirect } from "next/navigation";
import PromotionForm from "../../../components/admin/PromotionForm";
import { auth } from "../../../lib/auth";
import { isDatabaseConfigured } from "../../../lib/db";
import { getAdminPromotionSettings } from "../../../lib/promotion-store";
import { locales } from "../../../lib/i18n/locales";

export default async function AdminPromotionsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const settings = isDatabaseConfigured()
    ? await getAdminPromotionSettings()
    : null;

  const translations = locales.map((locale) => {
    const existing = settings?.translations.find((item) => item.locale === locale);

    return {
      locale,
      eyebrow: existing?.eyebrow ?? "",
      title: existing?.title ?? "",
      intro: existing?.intro ?? "",
      cartHint: existing?.cartHint ?? "",
    };
  });

  const tiers =
    settings?.tiers.map((tier, index) => ({
      minQuantity: tier.minQuantity,
      discountPercent: tier.discountPercent,
      sortOrder: tier.sortOrder ?? index,
      translations: locales.map((locale) => ({
        locale,
        label:
          tier.translations.find((item) => item.locale === locale)?.label ?? "",
      })),
    })) ?? [
      {
        minQuantity: 5,
        discountPercent: 20,
        sortOrder: 0,
        translations: locales.map((locale) => ({ locale, label: "" })),
      },
      {
        minQuantity: 10,
        discountPercent: 30,
        sortOrder: 1,
        translations: locales.map((locale) => ({ locale, label: "" })),
      },
    ];

  return (
    <section className="admin-page">
      {!isDatabaseConfigured() ? (
        <div className="admin-card admin-notice">
          <h3>Database not configured</h3>
          <p>
            Add <code>DATABASE_URL</code> to <code>.env.local</code>, run{" "}
            <code>npx prisma db push</code>, then <code>npm run db:seed</code>.
          </p>
        </div>
      ) : null}
      <PromotionForm
        initialValues={{
          active: settings?.active ?? true,
          translations,
          tiers,
        }}
      />
    </section>
  );
}
