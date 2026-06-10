export type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string;
  priceCents: number;
  leadTime: string;
  image: string;
  highlights: string[];
  updatedAt: string;
};

export const products: Product[] = [
  {
    slug: "pandan-chiffon-cake",
    name: "Pandan Chiffon Cake",
    category: "Cake",
    description:
      "Light, fluffy and fragrant pandan chiffon cake. A classic favourite with natural pandan aroma, perfect for family gatherings and celebrations.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/pandan-chiffon-cake.jpg",
    highlights: ["Soft and fluffy", "Natural pandan aroma", "Family favourite"],
    updatedAt: "2026-06-05",
  },
  {
    slug: "pandan-gula-melaka-chiffon-cake",
    name: "Pandan Gula Melaka Chiffon Cake",
    category: "Cake",
    description:
      "A fragrant pandan chiffon layered with rich gula melaka (palm sugar) for a sweet, caramel-like depth. A modern Singapore favourite made to order.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/pandan-gula-melaka-chiffon-cake.jpg",
    highlights: ["Pandan and gula melaka", "Light chiffon texture", "Made to order"],
    updatedAt: "2026-06-05",
  },
  {
    slug: "butter-cake",
    name: "Butter Cake",
    category: "Cake",
    description:
      "A classic buttery sponge with a tender crumb and comforting homemade flavour. Simple, nostalgic and always a crowd-pleaser.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/butter-cake.jpg",
    highlights: ["Rich butter flavour", "Moist crumb", "Everyday favourite"],
    updatedAt: "2026-06-05",
  },
  {
    slug: "coffee-walnut-cake",
    name: "Coffee Walnut Cake",
    category: "Cake",
    description:
      "Moist coffee sponge studded with crunchy walnuts and finished with a balanced coffee aroma. Ideal for tea time and gifting.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/coffee-walnut-cake.jpg",
    highlights: ["Coffee and walnut", "Moist sponge", "Great for gifting"],
    updatedAt: "2026-06-05",
  },
  {
    slug: "burnt-cheesecake",
    name: "Burnt Cheesecake",
    category: "Cake",
    description:
      "Creamy Basque-style burnt cheesecake with a caramelised top and molten centre. Rich, smooth and indulgent for special occasions.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/burnt-cheesecake.jpg",
    highlights: ["Caramelised top", "Creamy centre", "Celebration favourite"],
    updatedAt: "2026-06-05",
  },
  {
    slug: "fudge-brownies",
    name: "Fudge Brownies",
    category: "Brownie",
    description:
      "Dense, fudgy chocolate brownies with a deep cocoa flavour and a satisfying bite. Perfect for parties, gifts or a sweet treat at home.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/fudge-brownies.jpg",
    highlights: ["Rich and fudgy", "Deep chocolate", "Party favourite"],
    updatedAt: "2026-06-05",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
