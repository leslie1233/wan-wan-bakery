export type CartItem = {
  slug: string;
  name: string;
  quantity: number;
  priceCents: number;
};

export type CartState = {
  items: CartItem[];
};

export const CART_STORAGE_KEY = "wan-wan-bakery-cart";

export function getCartTotalCents(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.priceCents * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
