export type CatalogProduct = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  priceCents: number;
  image: string;
  highlights: string[];
  updatedAt: string;
  published?: boolean;
};

export type PromotionTierView = {
  id?: string;
  minQuantity: number;
  discountPercent: number;
  label: string;
  sortOrder: number;
};

export type PromotionView = {
  active: boolean;
  eyebrow: string;
  title: string;
  intro: string;
  cartHint: string;
  tiers: PromotionTierView[];
};
