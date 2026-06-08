"use client";

import { buildWhatsAppUrl } from "../lib/whatsapp";
import { generalEnquiryMessage } from "../lib/whatsapp-messages";
import { useDictionary } from "./LocaleProvider";
import { useSiteSettings } from "./SiteSettingsProvider";
import WhatsAppLink from "./WhatsAppLink";

export default function MobileBottomBar() {
  const dict = useDictionary();
  const contact = useSiteSettings();

  return (
    <div className="mobile-bottom-bar" aria-label="Quick contact actions">
      <WhatsAppLink
        href={buildWhatsAppUrl(
          generalEnquiryMessage(dict),
          contact.whatsappNumber
        )}
        className="mobile-bottom-button whatsapp"
        eventLabel="mobile_bar_whatsapp"
      >
        WhatsApp
      </WhatsAppLink>
      <a className="mobile-bottom-button call" href={`tel:${contact.phoneE164}`}>
        {dict.nav.contact}
      </a>
    </div>
  );
}
