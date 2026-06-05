import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Wan Wan Bakery | Garlic Bread, Pandan Chiffon Cake & Cheesecake Singapore",

  description:
    "Wan Wan Bakery in Singapore. Freshly baked garlic bread, pandan chiffon cake and cheesecake. WhatsApp 93855540.",

  keywords: [
    "Wan Wan Bakery",
    "Bakery Singapore",
    "Garlic Bread Singapore",
    "Pandan Chiffon Cake Singapore",
    "Cheesecake Singapore",
    "Fresh Bread Singapore",
    "Homemade Cake Singapore",
    "Birthday Cake Singapore"
  ],

  openGraph: {
    title: "Wan Wan Bakery",
    description:
      "Freshly baked garlic bread, pandan chiffon cake and cheesecake.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <a className="logo logo-with-image" href="/">
              <img
                src="/images/logo.jpg"
                alt="Wan Wan Bakery Logo"
              />
              <span>Wan Wan Bakery</span>
            </a>

            <nav className="navlinks">
              <a href="/">Home</a>
              <a href="/#products">Products</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container">
            <p>© {new Date().getFullYear()} Wan Wan Bakery</p>
            <p>WhatsApp / Call: 93855540</p>
          </div>
        </footer>

        <a
          href="https://wa.me/6593855540?text=Hi%20Wan%20Wan%20Bakery%2C%20I%20would%20like%20to%20enquire%20about%20your%20bakery%20items."
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
  💬 WhatsApp Us
</a>


      </body>
    </html>
  );
}