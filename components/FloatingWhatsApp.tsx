"use client";

import { buildWhatsAppUrl } from "../lib/whatsapp";
import { generalEnquiryMessage } from "../lib/whatsapp-messages";
import { useDictionary } from "./LocaleProvider";
import WhatsAppLink from "./WhatsAppLink";

export default function FloatingWhatsApp() {
  const dict = useDictionary();

  return (
    <WhatsAppLink
      href={buildWhatsAppUrl(generalEnquiryMessage(dict))}
      className="floating-whatsapp"
      eventLabel="floating_whatsapp"
      ariaLabel={dict.footer.whatsappUs}
    >
      <span className="floating-whatsapp-short">Chat</span>
      <span className="floating-whatsapp-full">{dict.footer.whatsappUs}</span>
    </WhatsAppLink>
  );
}
