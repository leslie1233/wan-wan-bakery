import { siteConfig } from "./site-config";

type OrderLine = {
  name: string;
  quantity: number;
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function generalEnquiryMessage(): string {
  return "Hi Wan Wan Bakery, I would like to enquire about your bakery items.";
}

export function productEnquiryMessage(
  productName: string,
  quantity?: number,
  pickupDate?: string,
  notes?: string
): string {
  const lines = [
    "Hi Wan Wan Bakery, I'd like to order:",
    `• Product: ${productName}`,
    `• Quantity: ${quantity ?? ""}`,
    `• Pickup date: ${pickupDate ?? ""}`,
  ];

  if (notes?.trim()) {
    lines.push(`• Notes: ${notes.trim()}`);
  }

  return lines.join("\n");
}

export function cartOrderMessage(
  items: OrderLine[],
  pickupDate?: string,
  notes?: string
): string {
  const lines = [
    "Hi Wan Wan Bakery, I'd like to place an order:",
    ...items.map((item) => `• ${item.name} x ${item.quantity}`),
    `• Pickup date: ${pickupDate ?? ""}`,
  ];

  if (notes?.trim()) {
    lines.push(`• Notes: ${notes.trim()}`);
  }

  return lines.join("\n");
}

export function formEnquiryMessage(
  productName: string,
  quantity: string,
  pickupDate: string,
  notes: string
): string {
  return productEnquiryMessage(productName, quantity ? Number(quantity) : undefined, pickupDate, notes);
}
