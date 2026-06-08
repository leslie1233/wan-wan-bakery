"use client";

import Link from "next/link";
import { formatCallLabel } from "../lib/phone";
import { siteConfig } from "../lib/site-config";
import { localePath } from "../lib/i18n/paths";
import FacebookShareLink from "./FacebookShareLink";
import { useLocale } from "./LocaleProvider";
import { useSiteSettings } from "./SiteSettingsProvider";
import WhatsAppLink from "./WhatsAppLink";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { generalEnquiryMessage } from "../lib/whatsapp-messages";

export default function Footer() {
  const { locale, dict } = useLocale();
  const contact = useSiteSettings();
  const whatsapp = buildWhatsAppUrl(
    generalEnquiryMessage(dict),
    contact.whatsappNumber
  );

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h2>{siteConfig.name}</h2>
          <p>{dict.hero.tagline}</p>
          <p>{dict.footer.hours}</p>
        </div>

        <div>
          <h3>{dict.footer.quickLinks}</h3>
          <ul className="footer-links">
            <li>
              <Link href={localePath(locale, "/products")}>{dict.nav.products}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/about")}>{dict.nav.about}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/faq")}>{dict.nav.faq}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/contact")}>{dict.nav.contact}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/cart")}>{dict.nav.cart}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>{dict.footer.orderWithUs}</h3>
          <p>
            <strong>{dict.footer.phone}</strong> {contact.phone}
          </p>
          <p>
            <strong>{dict.footer.pickup}</strong> {siteConfig.pickupArea}
          </p>
          <p>
            <strong>{dict.footer.payment}</strong>{" "}
            {siteConfig.paymentMethods.join(", ")}
          </p>
          <div className="cta footer-cta">
            <WhatsAppLink
              href={whatsapp}
              className="button"
              eventLabel="footer_whatsapp"
            >
              {dict.footer.whatsappUs}
            </WhatsAppLink>
            <a className="button secondary" href={`tel:${contact.phoneE164}`}>
              {formatCallLabel(dict.footer.call, contact.phone)}
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p>{dict.footer.replyNote}</p>
        <FacebookShareLink
          path={localePath(locale, "/")}
          className="button facebook footer-share"
          eventLabel="footer_facebook_share"
        >
          {dict.footer.shareFacebook}
        </FacebookShareLink>
      </div>
    </footer>
  );
}
