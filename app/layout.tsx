import type { Metadata, Viewport } from "next";
import Analytics from "../components/Analytics";
import { CartProvider } from "../components/CartProvider";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";
import Header from "../components/Header";
import JsonLd from "../components/JsonLd";
import MobileBottomBar from "../components/MobileBottomBar";
import { siteConfig } from "../lib/site-config";
import { localBusinessJsonLd } from "../lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Wan Wan Bakery | Garlic Bread, Pandan Chiffon Cake & Cheesecake Singapore",
    template: "%s | Wan Wan Bakery",
  },
  description: siteConfig.description,
  keywords: [
    "Wan Wan Bakery",
    "Bakery Singapore",
    "Garlic Bread Singapore",
    "Pandan Chiffon Cake Singapore",
    "Cheesecake Singapore",
    "Fresh Bread Singapore",
    "Homemade Cake Singapore",
    "Birthday Cake Singapore",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/images/logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/images/logo.jpg", type: "image/jpeg" }],
  },
  verification: siteConfig.googleSiteVerification
    ? {
        google: siteConfig.googleSiteVerification,
      }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b85c38",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <JsonLd data={localBusinessJsonLd()} />
          <Analytics />
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
          <FloatingWhatsApp />
          <MobileBottomBar />
        </CartProvider>
      </body>
    </html>
  );
}
