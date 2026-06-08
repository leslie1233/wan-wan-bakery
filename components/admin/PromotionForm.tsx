"use client";

import { FormEvent, useMemo, useState } from "react";
import { localeLabels, locales } from "../../lib/i18n/locales";

type PromotionTranslationForm = {
  locale: string;
  eyebrow: string;
  title: string;
  intro: string;
  cartHint: string;
};

type PromotionTierForm = {
  minQuantity: number;
  discountPercent: number;
  sortOrder: number;
  translations: { locale: string; label: string }[];
};

type PromotionFormProps = {
  initialValues: {
    active: boolean;
    translations: PromotionTranslationForm[];
    tiers: PromotionTierForm[];
  };
};

function emptyPromotionTranslations(): PromotionTranslationForm[] {
  return locales.map((locale) => ({
    locale,
    eyebrow: "",
    title: "",
    intro: "",
    cartHint: "",
  }));
}

function emptyTier(index: number): PromotionTierForm {
  return {
    minQuantity: index === 0 ? 5 : 10,
    discountPercent: index === 0 ? 20 : 30,
    sortOrder: index,
    translations: locales.map((locale) => ({ locale, label: "" })),
  };
}

export default function PromotionForm({ initialValues }: PromotionFormProps) {
  const [active, setActive] = useState(initialValues.active);
  const [translations, setTranslations] = useState(initialValues.translations);
  const [tiers, setTiers] = useState(initialValues.tiers);
  const [activeLocale, setActiveLocale] = useState("en");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const activeTranslation = useMemo(
    () =>
      translations.find((item) => item.locale === activeLocale) ??
      translations[0],
    [activeLocale, translations]
  );

  function updateTranslation(
    field: keyof PromotionTranslationForm,
    value: string
  ) {
    setTranslations((current) =>
      current.map((item) =>
        item.locale === activeLocale ? { ...item, [field]: value } : item
      )
    );
  }

  function updateTier(index: number, field: "minQuantity" | "discountPercent", value: number) {
    setTiers((current) =>
      current.map((tier, tierIndex) =>
        tierIndex === index ? { ...tier, [field]: value } : tier
      )
    );
  }

  function updateTierLabel(tierIndex: number, locale: string, label: string) {
    setTiers((current) =>
      current.map((tier, index) =>
        index === tierIndex
          ? {
              ...tier,
              translations: tier.translations.map((translation) =>
                translation.locale === locale
                  ? { ...translation, label }
                  : translation
              ),
            }
          : tier
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/admin/promotions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active,
        translations,
        tiers,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Unable to save promotion.");
      setLoading(false);
      return;
    }

    setSuccess("Promotion saved.");
    setLoading(false);
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2>Bulk order promotion</h2>
      <p className="admin-intro">
        Set discount tiers and translated labels shown on the website and cart.
      </p>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        Promotion active
      </label>

      <div className="admin-locale-tabs">
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            className={locale === activeLocale ? "active" : ""}
            onClick={() => setActiveLocale(locale)}
          >
            {localeLabels[locale]}
          </button>
        ))}
      </div>

      {activeTranslation ? (
        <div className="admin-grid">
          <label>
            Eyebrow ({activeLocale})
            <input
              value={activeTranslation.eyebrow}
              onChange={(event) => updateTranslation("eyebrow", event.target.value)}
            />
          </label>
          <label>
            Title ({activeLocale})
            <input
              value={activeTranslation.title}
              onChange={(event) => updateTranslation("title", event.target.value)}
            />
          </label>
          <label className="admin-full">
            Intro ({activeLocale})
            <textarea
              rows={3}
              value={activeTranslation.intro}
              onChange={(event) => updateTranslation("intro", event.target.value)}
            />
          </label>
          <label className="admin-full">
            Cart hint ({activeLocale})
            <input
              value={activeTranslation.cartHint}
              onChange={(event) => updateTranslation("cartHint", event.target.value)}
            />
          </label>
        </div>
      ) : null}

      <h3>Discount tiers</h3>
      {tiers.map((tier, index) => (
        <div key={index} className="admin-tier-card">
          <div className="admin-grid">
            <label>
              Minimum quantity
              <input
                type="number"
                value={tier.minQuantity}
                onChange={(event) =>
                  updateTier(index, "minQuantity", Number(event.target.value))
                }
              />
            </label>
            <label>
              Discount %
              <input
                type="number"
                value={tier.discountPercent}
                onChange={(event) =>
                  updateTier(index, "discountPercent", Number(event.target.value))
                }
              />
            </label>
            <label className="admin-full">
              Label ({activeLocale})
              <input
                value={
                  tier.translations.find((item) => item.locale === activeLocale)
                    ?.label ?? ""
                }
                onChange={(event) =>
                  updateTierLabel(index, activeLocale, event.target.value)
                }
              />
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="button secondary admin-button"
        onClick={() => setTiers((current) => [...current, emptyTier(current.length)])}
      >
        Add tier
      </button>

      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}

      <button type="submit" className="button admin-button" disabled={loading}>
        {loading ? "Saving..." : "Save promotion"}
      </button>
    </form>
  );
}
