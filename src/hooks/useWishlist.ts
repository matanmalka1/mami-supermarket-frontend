import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "freshmarket:wishlist";

const readInitialWishlist = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === "string");
  } catch {
    // ignore malformed values
  }
  return [];
};

export const useWishlist = () => {
  const [items, setItems] = useState<string[]>(readInitialWishlist);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors (quota, etc.)
    }
  }, [items]);

  const toggleWishlist = useCallback((productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  );

  return { items, toggleWishlist, isWishlisted };
};
