import WhatsAppLink from "./WhatsAppLink";
import { buildWhatsAppUrl, generalEnquiryMessage } from "../lib/whatsapp";

export default function FloatingWhatsApp() {
  return (
    <WhatsAppLink
      href={buildWhatsAppUrl(generalEnquiryMessage())}
      className="floating-whatsapp"
      eventLabel="floating_whatsapp"
      ariaLabel="Chat with Wan Wan Bakery on WhatsApp"
    >
      <span className="floating-whatsapp-short">Chat</span>
      <span className="floating-whatsapp-full">WhatsApp Us</span>
    </WhatsAppLink>
  );
}
