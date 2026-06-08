"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { localeLabels, locales } from "../../lib/i18n/locales";

type TranslationForm = {
  locale: string;
  name: string;
  category: string;
  description: string;
  highlights: string;
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: {
    slug: string;
    image: string;
    priceCents: number;
    published: boolean;
    sortOrder: number;
    translations: TranslationForm[];
  };
};

function emptyTranslations(): TranslationForm[] {
  return locales.map((locale) => ({
    locale,
    name: "",
    category: "",
    description: "",
    highlights: "",
  }));
}

export default function ProductForm({
  mode,
  productId,
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [image, setImage] = useState(initialValues?.image ?? "/images/");
  const [priceCents, setPriceCents] = useState(initialValues?.priceCents ?? 0);
  const [published, setPublished] = useState(initialValues?.published ?? true);
  const [sortOrder, setSortOrder] = useState(initialValues?.sortOrder ?? 0);
  const [translations, setTranslations] = useState<TranslationForm[]>(
    initialValues?.translations ?? emptyTranslations()
  );
  const [activeLocale, setActiveLocale] = useState("en");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const activeTranslation = useMemo(
    () => translations.find((item) => item.locale === activeLocale) ?? translations[0],
    [activeLocale, translations]
  );

  function updateTranslation(field: keyof TranslationForm, value: string) {
    setTranslations((current) =>
      current.map((item) =>
        item.locale === activeLocale ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      slug,
      image,
      priceCents,
      published,
      sortOrder,
      translations: translations
        .filter((item) => item.name.trim())
        .map((item) => ({
          locale: item.locale,
          name: item.name.trim(),
          category: item.category.trim(),
          description: item.description.trim(),
          highlights: item.highlights
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        })),
    };

    const response = await fetch(
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${productId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Unable to save product.");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (mode !== "edit" || !productId) {
      return;
    }

    if (!window.confirm("Delete this product permanently?")) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Unable to delete product.");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <h2>{mode === "create" ? "Add product" : "Edit product"}</h2>

      <div className="admin-grid">
        <label>
          Slug
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="garlic-bread"
            required
          />
        </label>
        <label>
          Image path
          <input
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="/images/garlic-bread.jpg"
            required
          />
        </label>
        <label>
          Sort order
          <input
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </label>
        <label>
          Price (cents)
          <input
            type="number"
            value={priceCents}
            onChange={(event) => setPriceCents(Number(event.target.value))}
          />
        </label>
      </div>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
        />
        Published on website
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
            Name ({activeLocale})
            <input
              value={activeTranslation.name}
              onChange={(event) => updateTranslation("name", event.target.value)}
            />
          </label>
          <label>
            Category ({activeLocale})
            <input
              value={activeTranslation.category}
              onChange={(event) =>
                updateTranslation("category", event.target.value)
              }
            />
          </label>
          <label className="admin-full">
            Description ({activeLocale})
            <textarea
              rows={5}
              value={activeTranslation.description}
              onChange={(event) =>
                updateTranslation("description", event.target.value)
              }
            />
          </label>
          <label className="admin-full">
            Highlights ({activeLocale}, comma-separated)
            <input
              value={activeTranslation.highlights}
              onChange={(event) =>
                updateTranslation("highlights", event.target.value)
              }
              placeholder="Freshly baked, Garlic butter"
            />
          </label>
        </div>
      ) : null}

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-actions">
        <button type="submit" className="button admin-button" disabled={loading}>
          {loading ? "Saving..." : "Save product"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            className="button secondary admin-button"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
