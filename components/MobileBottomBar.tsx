"use client";

import { siteConfig } from "../lib/site-config";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { generalEnquiryMessage } from "../lib/whatsapp-messages";
import { useDictionary } from "./LocaleProvider";
import WhatsAppLink from "./WhatsAppLink";

export default function MobileBottomBar() {
  const dict = useDictionary();

  return (
    <div className="mobile-bottom-bar" aria-label="Quick contact actions">
      <WhatsAppLink
        href={buildWhatsAppUrl(generalEnquiryMessage(dict))}
        className="mobile-bottom-button whatsapp"
        eventLabel="mobile_bar_whatsapp"
      >
        WhatsApp
      </WhatsAppLink>
      <a className="mobile-bottom-button call" href={`tel:${siteConfig.phoneE164}`}>
        {dict.nav.contact}
      </a>
    </div>
  );
}
