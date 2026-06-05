import { siteConfig } from "../lib/site-config";

export const faqEntries = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, add items to your cart or tap WhatsApp on any product page. Send us your preferred pickup date and we will confirm availability.",
  },
  {
    question: "How far in advance should I order?",
    answer:
      "Garlic bread can often be arranged with shorter notice. Cakes are best ordered 1–3 days ahead, especially for weekends and celebrations.",
  },
  {
    question: "What are your prices?",
    answer:
      "Prices shown on the website are starting prices. Final pricing may vary by size or customization. We will confirm the exact amount on WhatsApp.",
  },
  {
    question: "Do you deliver?",
    answer: `We currently focus on ${siteConfig.pickupArea.toLowerCase()}. Contact us on WhatsApp to discuss collection arrangements.`,
  },
  {
    question: "What payment methods do you accept?",
    answer: `We accept ${siteConfig.paymentMethods.join(" and ")} upon collection.`,
  },
  {
    question: "Can I customize my cake?",
    answer:
      "Yes. Message us on WhatsApp with your occasion, preferred flavour, and serving size. We will advise what is possible and the lead time required.",
  },
  {
    question: "How quickly do you reply?",
    answer: `Most enquiries receive a reply ${siteConfig.replyTime} during business hours.`,
  },
];
