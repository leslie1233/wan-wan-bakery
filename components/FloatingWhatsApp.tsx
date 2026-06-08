"use client";

import { buildWhatsAppUrl } from "../lib/whatsapp";
import { generalEnquiryMessage } from "../lib/whatsapp-messages";
import { useDictionary } from "./LocaleProvider";
import { useSiteSettings } from "./SiteSettingsProvider";
import WhatsAppLink from "./WhatsAppLink";

export default function FloatingWhatsApp() {
  const dict = useDictionary();
  const contact = useSiteSettings();

  return (
    <WhatsAppLink
      href={buildWhatsAppUrl(
        generalEnquiryMessage(dict),
        contact.whatsappNumber
      )}
      className="floating-whatsapp"
      eventLabel="floating_whatsapp"
      ariaLabel={dict.footer.whatsappUs}
    >
      <span className="floating-whatsapp-short">Chat</span>
      <span className="floating-whatsapp-full">{dict.footer.whatsappUs}</span>
    </WhatsAppLink>
  );
}
