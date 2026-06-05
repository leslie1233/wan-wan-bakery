"use client";

import { siteConfig } from "../lib/site-config";
import WhatsAppLink from "./WhatsAppLink";
import { buildWhatsAppUrl, generalEnquiryMessage } from "../lib/whatsapp";

export default function MobileBottomBar() {
  return (
    <div className="mobile-bottom-bar" aria-label="Quick contact actions">
      <WhatsAppLink
        href={buildWhatsAppUrl(generalEnquiryMessage())}
        className="mobile-bottom-button whatsapp"
        eventLabel="mobile_bar_whatsapp"
      >
        WhatsApp
      </WhatsAppLink>
      <a className="mobile-bottom-button call" href={`tel:${siteConfig.phoneE164}`}>
        Call
      </a>
    </div>
  );
}
