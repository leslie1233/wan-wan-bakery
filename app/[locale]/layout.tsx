import { notFound } from "next/navigation";
import Analytics from "../../components/Analytics";
import { CartProvider } from "../../components/CartProvider";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import LocaleHtmlLang from "../../components/LocaleHtmlLang";
import { LocaleProvider } from "../../components/LocaleProvider";
import MobileBottomBar from "../../components/MobileBottomBar";
import { getDictionary } from "../../lib/i18n/get-dictionary";
import {
  isLocale,
  localeHtmlLang,
  type Locale,
} from "../../lib/i18n/locales";
import { localBusinessJsonLd } from "../../lib/structured-data";

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "zh" },
    { locale: "ko" },
    { locale: "ja" },
    { locale: "es" },
    { locale: "fr" },
    { locale: "id" },
    { locale: "ta" },
    { locale: "ms" },
    { locale: "fil" },
    { locale: "th" },
  ];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dict={dict}>
      <LocaleHtmlLang lang={localeHtmlLang[locale]} />
      <JsonLd data={localBusinessJsonLd()} />
      <Analytics />
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </LocaleProvider>
  );
}
