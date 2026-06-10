export const siteConfig = {
  name: "Wan Wan Bakery",
  tagline: "Fresh Homemade Cakes in Singapore",
  description:
    "Wan Wan Bakery in Singapore. Pandan chiffon, butter cake, burnt cheesecake, fudge brownies and more. Order via WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wanwanbakery.com",
  phone: "81571573",
  phoneE164: "+6581571573",
  whatsappNumber: "6581571573",
  locale: "en_SG",
  currency: "SGD",
  yearsBaking: 15,
  replyTime: "within a few hours",
  pickupArea: "Singapore (self-collection)",
  paymentMethods: ["PayNow", "Cash"],
  hours: "Mon–Sun, 9am–6pm (by appointment for collection)",
  lastContentUpdate: "2025-06-01",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  },
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;
