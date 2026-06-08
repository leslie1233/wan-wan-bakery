import EnquiryForm from "../../../components/EnquiryForm";
import WhatsAppLink from "../../../components/WhatsAppLink";
import { getCatalogProducts } from "../../../lib/catalog";
import { getDictionary } from "../../../lib/i18n/get-dictionary";
import { isLocale, type Locale } from "../../../lib/i18n/locales";
import { createPageMetadata } from "../../../lib/metadata";
import { formatCallLabel } from "../../../lib/phone";
import { getSiteSettings } from "../../../lib/site-settings";
import { siteConfig } from "../../../lib/site-config";
import { buildWhatsAppUrl } from "../../../lib/whatsapp";
import { generalEnquiryMessage } from "../../../lib/whatsapp-messages";
import { notFound } from "next/navigation";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return createPageMetadata({
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const [products, contact] = await Promise.all([
    getCatalogProducts(locale),
    getSiteSettings(),
  ]);
  const whatsapp = buildWhatsAppUrl(
    generalEnquiryMessage(dict),
    contact.whatsappNumber
  );

  return (
    <main className="container section page-main">
      <div className="contact-box">
        <h1>{dict.contact.title}</h1>
        <p>{dict.contact.intro}</p>
        <p>
          <strong>{dict.contact.phone}</strong> {contact.phone}
        </p>
        <p>
          <strong>{dict.contact.pickup}</strong> {siteConfig.pickupArea}
        </p>
        <p>
          <strong>{dict.contact.payment}</strong>{" "}
          {siteConfig.paymentMethods.join(", ")}
        </p>

        <div className="cta">
          <WhatsAppLink
            href={whatsapp}
            className="button"
            eventLabel="contact_whatsapp"
          >
            {dict.contact.whatsappUs}
          </WhatsAppLink>
          <a className="button secondary" href={`tel:${contact.phoneE164}`}>
            {formatCallLabel(dict.contact.call, contact.phone)}
          </a>
        </div>
      </div>

      <section className="section">
        <h2>{dict.contact.enquiryTitle}</h2>
        <p className="section-intro">{dict.contact.enquiryIntro}</p>
        <EnquiryForm products={products} />
        <p className="section-intro">{dict.contact.privacy}</p>
      </section>
    </main>
  );
}
