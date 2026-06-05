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
    slug: "garlic-bread",
    name: "Garlic Bread",
    category: "Bread",
    description:
      "Crafted fresh to order, our garlic bread pairs a delicately crisp crust with a pillowy, buttery interior. Infused with slow-roasted garlic and fine herbs, each loaf is baked for depth of flavour — refined at the dinner table, yet effortless for everyday sharing.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/garlic-bread.jpg",
    highlights: ["Freshly baked", "Garlic butter", "Perfect for sharing"],
    updatedAt: "2025-06-01",
  },
  {
    slug: "pandan-chiffon-cake",
    name: "Pandan Chiffon Cake",
    category: "Cake",
    description:
      "Light, fluffy and fragrant pandan chiffon cake. A classic favourite suitable for family gatherings and celebrations.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/pandan-chiffon-cake.jpg",
    highlights: ["Soft and fluffy", "Pandan flavour", "Family favourite"],
    updatedAt: "2025-06-01",
  },
  {
    slug: "cheese-cake",
    name: "Cheesecake",
    category: "Cake",
    description:
      "Rich and creamy cheesecake with smooth texture and balanced sweetness. Suitable for birthdays and special occasions.",
    price: "Contact for price",
    priceCents: 0,
    leadTime: "Order 1–3 days in advance",
    image: "/images/cheese-cake.jpg",
    highlights: ["Creamy texture", "Celebration cake", "Made to order"],
    updatedAt: "2025-06-01",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
