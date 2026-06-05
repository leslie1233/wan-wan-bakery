import type { Metadata } from "next";
import { createPageMetadata } from "../../lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Your Cart",
    description: "Review your Wan Wan Bakery order and send it on WhatsApp.",
    path: "/cart",
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
