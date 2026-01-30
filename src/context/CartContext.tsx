import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { CartContext, CartItem } from "./cart-context";

const STORAGE_PREFIX = "mami_cart";
const GUEST_STORAGE_KEY = `${STORAGE_PREFIX}_guest`;

const resolveCartKey = (): string => {
  if (typeof window === "undefined") return GUEST_STORAGE_KEY;
  const token =
    sessionStorage.getItem("mami_token") ||
    localStorage.getItem("mami_token") ||
    "";
  if (!token) return GUEST_STORAGE_KEY;
  const userId = extractUserId(token);
  const suffix = userId || token.slice(0, 8);
  return `${STORAGE_PREFIX}_user_${encodeURIComponent(suffix)}`;
};

const extractUserId = (token: string): string | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return (
      String(payload.sub || payload.user_id || payload.userId || payload.id || "")
    ).trim() || null;
  } catch {
    return null;
  }
};

const readCartFromStorage = (key: string): CartItem[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const storageKey = useMemo(resolveCartKey, [isAuthenticated]);
  const prevKeyRef = useRef<string>(storageKey);
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage(storageKey));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (prevKeyRef.current !== storageKey) {
      setItems(readCartFromStorage(storageKey));
      prevKeyRef.current = storageKey;
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = (product: any) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
    setIsOpen(true);
  };

  const removeItem = (id: number | string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number | string, qty: number) => {
    if (qty < 1) return removeItem(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};
