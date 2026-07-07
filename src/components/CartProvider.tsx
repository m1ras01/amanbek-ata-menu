"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import type { CartLine, Dish } from "@/lib/types";

const CART_KEY = "amanbek_cart";
const ORDER_KEY = "amanbek_order_id";

interface CartContextValue {
  items: CartLine[];
  table: string | null;
  orderId: string | null;
  totalCount: number;
  totalPrice: number;
  addItem: (dish: Dish, qty?: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  syncOrder: () => Promise<string | null>;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  table: null,
  orderId: null,
  totalCount: 0,
  totalPrice: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  syncOrder: async () => null,
});

function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CartLine[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const table = searchParams.get("table");

  useEffect(() => {
    setItems(loadCart());
    setOrderId(localStorage.getItem(ORDER_KEY));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, ready]);

  const totalCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((s, i) => s + i.dish.price * i.quantity, 0),
    [items]
  );

  const addItem = useCallback((dish: Dish, qty = 1) => {
    if (!dish.isAvailable) return;
    setItems((prev) => {
      const existing = prev.find((l) => l.dish.id === dish.id);
      if (existing) {
        return prev.map((l) =>
          l.dish.id === dish.id
            ? { ...l, quantity: l.quantity + qty }
            : l
        );
      }
      return [...prev, { dish, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((dishId: string) => {
    setItems((prev) => prev.filter((l) => l.dish.id !== dishId));
  }, []);

  const updateQuantity = useCallback((dishId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((l) => l.dish.id !== dishId));
      return;
    }
    setItems((prev) =>
      prev.map((l) => (l.dish.id === dishId ? { ...l, quantity } : l))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setOrderId(null);
    localStorage.removeItem(ORDER_KEY);
  }, []);

  const syncOrder = useCallback(async (): Promise<string | null> => {
    if (items.length === 0) return null;

    const orderItems = items.map((l) => ({
      dishId: l.dish.id,
      quantity: l.quantity,
      name: l.dish.name,
      price: l.dish.price,
      weightOrVolume: l.dish.weightOrVolume,
    }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: orderItems,
        table: table ?? undefined,
        orderId: orderId ?? undefined,
      }),
    });

    if (!res.ok) return null;

    const order = await res.json();
    setOrderId(order.id);
    localStorage.setItem(ORDER_KEY, order.id);
    return order.id as string;
  }, [items, table, orderId]);

  if (!ready) return null;

  return (
    <CartContext.Provider
      value={{
        items,
        table,
        orderId,
        totalCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
