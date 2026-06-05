export type Product = {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: string;
  leadTime: string;
  image: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    slug: "garlic-bread",
    name: "Garlic Bread",
    category: "Bread",
    description:
      "Freshly baked garlic bread made with premium butter and aromatic garlic. Crispy on the outside and soft on the inside.",
    price: "Contact for price",
    leadTime: "Order in advance recommended",
    image: "/images/garlic-bread.jpg",
    highlights: ["Freshly baked", "Garlic butter", "Perfect for sharing"]
  },
  {
    slug: "pandan-chiffon-cake",
    name: "Pandan Chiffon Cake",
    category: "Cake",
    description:
      "Light, fluffy and fragrant pandan chiffon cake. A classic favourite suitable for family gatherings and celebrations.",
    price: "Contact for price",
    leadTime: "Order 1–3 days in advance recommended",
    image: "/images/pandan-chiffon-cake.jpg",
    highlights: ["Soft and fluffy", "Pandan flavour", "Family favourite"]
  },
  {
    slug: "cheese-cake",
    name: "Cheesecake",
    category: "Cake",
    description:
      "Rich and creamy cheesecake with smooth texture and balanced sweetness. Suitable for birthdays and special occasions.",
    price: "Contact for price",
    leadTime: "Order 1–3 days in advance recommended",
    image: "/images/cheese-cake.jpg",
    highlights: ["Creamy texture", "Celebration cake", "Made to order"]
  }
];