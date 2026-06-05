export type ProductSlug = "garlic-bread" | "pandan-chiffon-cake" | "cheese-cake";

export type FaqItem = {
  question: string;
  answer: string;
};

export type ProductTranslation = {
  name: string;
  category: string;
  description: string;
  highlights: string[];
};

export type Dictionary = {
  meta: {
    homeTitle: string;
    homeDescription: string;
    productsTitle: string;
    productsDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    contactTitle: string;
    contactDescription: string;
    faqTitle: string;
    faqDescription: string;
    cartTitle: string;
    cartDescription: string;
  };
  nav: {
    home: string;
    products: string;
    about: string;
    faq: string;
    contact: string;
    cart: string;
    skipToContent: string;
    toggleNav: string;
    language: string;
  };
  hero: {
    tagline: string;
    subtitle: string;
    orderWhatsApp: string;
    viewMenu: string;
    call: string;
    bannerAlt: string;
  };
  home: {
    productsTitle: string;
    productsIntro: string;
    orderEnquiryTitle: string;
    orderEnquiryText: string;
    contactBakery: string;
    reviewCart: string;
    shareFacebook: string;
  };
  promotion: {
    eyebrow: string;
    title: string;
    intro: string;
    tier5: string;
    tier10: string;
    cartQualified: string;
    cartHint: string;
  };
  trust: {
    title: string;
    yearsTitle: string;
    yearsText: string;
    madeToOrderTitle: string;
    madeToOrderText: string;
    fastRepliesTitle: string;
    fastRepliesText: string;
    testimonials: { quote: string; author: string }[];
  };
  productsPage: {
    title: string;
    intro: string;
    viewDetails: string;
    orderWhatsApp: string;
    leadTime: string;
    urgency: string;
    highlights: string;
    orderThis: string;
    askQuestion: string;
    backToCatalogue: string;
    shareFacebook: string;
    notFound: string;
    backHome: string;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    howItWorks: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    viewProducts: string;
    contactUs: string;
  };
  contact: {
    title: string;
    intro: string;
    phone: string;
    pickup: string;
    payment: string;
    whatsappUs: string;
    call: string;
    enquiryTitle: string;
    enquiryIntro: string;
    privacy: string;
    formProduct: string;
    formQuantity: string;
    formPickupDate: string;
    formNotes: string;
    formNotesPlaceholder: string;
    formSubmit: string;
  };
  cart: {
    title: string;
    empty: string;
    viewProducts: string;
    qty: string;
    remove: string;
    pricingNote: string;
    pickupDate: string;
    notes: string;
    notesPlaceholder: string;
    sendOrder: string;
    clearCart: string;
    addToCart: string;
    addedToCart: string;
  };
  faq: {
    title: string;
    intro: string;
    items: FaqItem[];
  };
  footer: {
    quickLinks: string;
    orderWithUs: string;
    phone: string;
    pickup: string;
    payment: string;
    whatsappUs: string;
    call: string;
    replyNote: string;
    shareFacebook: string;
    hours: string;
  };
  notFound: {
    title: string;
    text: string;
    viewProducts: string;
    backHome: string;
  };
  products: Record<ProductSlug, ProductTranslation>;
  whatsapp: {
    general: string;
    orderIntro: string;
    product: string;
    quantity: string;
    pickupDate: string;
    notes: string;
    placeOrder: string;
    totalQuantity: string;
    bulkPromotion: string;
    bulkNotQualified: string;
    questionAbout: string;
  };
};
