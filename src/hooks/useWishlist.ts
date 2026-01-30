
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "Mami Supermarket:wishlist";

export type WishlistItem = {
  id: number;
  note?: string;
  priority?: number;
};

const readInitialWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === "number") return { id: item };
          if (typeof item === "object" && item !== null && typeof item.id === "number") {
            return {
              id: item.id,
              note: typeof item.note === "string" ? item.note : undefined,
              priority: typeof item.priority === "number" ? item.priority : undefined,
            };
          }
          return null;
        })
        .filter((item): item is WishlistItem => !!item && !Number.isNaN(item.id));
    }
  } catch {
    // ignore malformed values
  }
  return [];
};

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>(readInitialWishlist);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors (quota, etc.)
    }
  }, [items]);

  const toggleWishlist = useCallback((productId: number) => {
    setItems((prev) =>
      prev.some((item) => item.id === productId)
        ? prev.filter((item) => item.id !== productId)
        : [...prev, { id: productId }],
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items],
  );

  const updateWishlistItem = useCallback((productId: number, changes: Partial<Omit<WishlistItem, "id">>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, ...changes } : item
      )
    );
  }, []);

  const removeWishlistItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  return {
    items,
    toggleWishlist,
    isWishlisted,
    updateWishlistItem,
    removeWishlistItem,
  };
};
