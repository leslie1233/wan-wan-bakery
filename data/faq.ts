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
      "Please order 1–3 days in advance for all items, especially for weekends and celebrations.",
  },
  {
    question: "Do you have any promotions?",
    answer:
      "Yes. Buy 5 items and get 20% off, or buy 10 items and get 30% off. The discount applies to your total order quantity.",
  },
  {
    question: "What are your prices?",
    answer:
      "Pricing depends on size and customization. Message us on WhatsApp with what you need and we will confirm the exact amount.",
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
