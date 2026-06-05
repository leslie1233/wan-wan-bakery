"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  getCartItemCount,
  getCartTotalCents,
  type CartItem,
} from "../lib/cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: getCartItemCount(items),
      totalCents: getCartTotalCents(items),
      addItem: (item, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((entry) => entry.slug === item.slug);

          if (existing) {
            return current.map((entry) =>
              entry.slug === item.slug
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry
            );
          }

          return [...current, { ...item, quantity }];
        });
      },
      updateQuantity: (slug, quantity) => {
        if (quantity <= 0) {
          setItems((current) => current.filter((entry) => entry.slug !== slug));
          return;
        }

        setItems((current) =>
          current.map((entry) =>
            entry.slug === slug ? { ...entry, quantity } : entry
          )
        );
      },
      removeItem: (slug) => {
        setItems((current) => current.filter((entry) => entry.slug !== slug));
      },
      clearCart: () => setItems([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
