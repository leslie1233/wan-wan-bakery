import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Wan Wan Bakery",
  description: "Contact Wan Wan Bakery at 93855540 for garlic bread, pandan chiffon cake, and cheese cake enquiries."
};

export default function ContactPage() {
  const whatsapp = "https://wa.me/6593855540?text=Hi%20Wan%20Wan%20Bakery%2C%20I%20would%20like%20to%20enquire%20about%20your%20products.";

  return (
    <main className="container section">
      <div className="contact-box">
        <h1>Contact Wan Wan Bakery</h1>
        <p>For product availability, pricing, or order enquiry, contact us directly.</p>
        <p><strong>Phone / WhatsApp:</strong> 93855540</p>
        <div className="cta">
          <a className="button" href={whatsapp}>WhatsApp Us</a>
          <a className="button secondary" href="tel:+6593855540">Call 93855540</a>
        </div>
      </div>
    </main>
  );
}
