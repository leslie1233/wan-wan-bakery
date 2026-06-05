import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../../lib/i18n/locales";
import { createPageMetadata } from "../../../lib/metadata";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return {
    ...createPageMetadata({
      title: dict.meta.cartTitle,
      description: dict.meta.cartDescription,
      path: "/cart",
      locale,
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function CartLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return children;
}
