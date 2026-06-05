import type { Dictionary } from "./i18n/types";

type OrderLine = {
  name: string;
  quantity: number;
};

export function generalEnquiryMessage(dict: Dictionary): string {
  return dict.whatsapp.general;
}

export function productEnquiryMessage(
  dict: Dictionary,
  productName: string,
  quantity?: number,
  pickupDate?: string,
  notes?: string
): string {
  const lines = [
    dict.whatsapp.orderIntro,
    `• ${dict.whatsapp.product}: ${productName}`,
    `• ${dict.whatsapp.quantity}: ${quantity ?? ""}`,
    `• ${dict.whatsapp.pickupDate}: ${pickupDate ?? ""}`,
  ];

  if (notes?.trim()) {
    lines.push(`• ${dict.whatsapp.notes}: ${notes.trim()}`);
  }

  return lines.join("\n");
}

export function cartOrderMessage(
  dict: Dictionary,
  items: OrderLine[],
  pickupDate?: string,
  notes?: string
): string {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const promotionLabel =
    totalQuantity >= 10
      ? dict.promotion.tier10
      : totalQuantity >= 5
        ? dict.promotion.tier5
        : null;

  const lines = [
    dict.whatsapp.placeOrder,
    ...items.map((item) => `• ${item.name} x ${item.quantity}`),
    `• ${dict.whatsapp.totalQuantity}: ${totalQuantity}`,
    promotionLabel
      ? `• ${dict.whatsapp.bulkPromotion}: ${promotionLabel}`
      : `• ${dict.whatsapp.bulkPromotion}: ${dict.whatsapp.bulkNotQualified}`,
    `• ${dict.whatsapp.pickupDate}: ${pickupDate ?? ""}`,
  ];

  if (notes?.trim()) {
    lines.push(`• ${dict.whatsapp.notes}: ${notes.trim()}`);
  }

  return lines.join("\n");
}

export function productQuestionMessage(
  dict: Dictionary,
  productName: string
): string {
  return dict.whatsapp.questionAbout.replace("{{product}}", productName);
}
