import EnquiryForm from "../../components/EnquiryForm";
import WhatsAppLink from "../../components/WhatsAppLink";
import { createPageMetadata } from "../../lib/metadata";
import { siteConfig } from "../../lib/site-config";
import { buildWhatsAppUrl, generalEnquiryMessage } from "../../lib/whatsapp";

export const metadata = createPageMetadata({
  title: "Contact Wan Wan Bakery",
  description:
    "Contact Wan Wan Bakery at 81571573 for garlic bread, pandan chiffon cake, and cheesecake enquiries in Singapore.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsapp = buildWhatsAppUrl(generalEnquiryMessage());

  return (
    <main className="container section page-main">
      <div className="contact-box">
        <h1>Contact Wan Wan Bakery</h1>
        <p>
          For product availability, pricing, or order enquiry, contact us directly.
          We usually reply {siteConfig.replyTime}.
        </p>
        <p>
          <strong>Phone / WhatsApp:</strong> {siteConfig.phone}
        </p>
        <p>
          <strong>Pickup:</strong> {siteConfig.pickupArea}
        </p>
        <p>
          <strong>Payment:</strong> {siteConfig.paymentMethods.join(", ")}
        </p>

        <div className="cta">
          <WhatsAppLink
            href={whatsapp}
            className="button"
            eventLabel="contact_whatsapp"
          >
            WhatsApp Us
          </WhatsAppLink>
          <a className="button secondary" href={`tel:${siteConfig.phoneE164}`}>
            Call {siteConfig.phone}
          </a>
        </div>
      </div>

      <section className="section">
        <h2>Structured Order Enquiry</h2>
        <p className="section-intro">
          Fill in the details below and we will open WhatsApp with your message
          pre-filled.
        </p>
        <EnquiryForm />
        <p className="section-intro">
          We only collect the details you send for order enquiries and do not
          share your information with third parties.
        </p>
      </section>
    </main>
  );
}
