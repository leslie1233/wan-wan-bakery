import Link from "next/link";
import { siteConfig } from "../lib/site-config";
import FacebookShareLink from "./FacebookShareLink";
import WhatsAppLink from "./WhatsAppLink";
import { buildWhatsAppUrl, generalEnquiryMessage } from "../lib/whatsapp";

export default function Footer() {
  const whatsapp = buildWhatsAppUrl(generalEnquiryMessage());

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h2>{siteConfig.name}</h2>
          <p>{siteConfig.tagline}</p>
          <p>{siteConfig.hours}</p>
        </div>

        <div>
          <h3>Quick links</h3>
          <ul className="footer-links">
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Order with us</h3>
          <p>
            <strong>Phone / WhatsApp:</strong> {siteConfig.phone}
          </p>
          <p>
            <strong>Pickup:</strong> {siteConfig.pickupArea}
          </p>
          <p>
            <strong>Payment:</strong> {siteConfig.paymentMethods.join(", ")}
          </p>
          <div className="cta footer-cta">
            <WhatsAppLink
              href={whatsapp}
              className="button"
              eventLabel="footer_whatsapp"
            >
              WhatsApp Us
            </WhatsAppLink>
            <a className="button secondary" href={`tel:${siteConfig.phoneE164}`}>
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        <p>Most customers order via WhatsApp — we reply {siteConfig.replyTime}.</p>
        <FacebookShareLink
          path="/"
          className="button facebook footer-share"
          eventLabel="footer_facebook_share"
        >
          Share on Facebook
        </FacebookShareLink>
      </div>
    </footer>
  );
}
