import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { CartContext, CartItem } from "./cart-context";

const STORAGE_KEY = "mami_cart";

const readCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storageKey = useMemo(() => STORAGE_KEY, []);
  const prevKeyRef = useRef<string>(storageKey);
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (prevKeyRef.current !== storageKey) {
      setItems(readCartFromStorage());
      prevKeyRef.current = storageKey;
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = (product: any) => {
    let added = false;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const availableQty =
        typeof product.availableQuantity === "number"
          ? Math.max(0, product.availableQuantity)
          : undefined;
      const currentQty = existing ? existing.quantity : 0;

      if (availableQty !== undefined) {
        if (availableQty <= 0) {
          toast.error("This item is out of stock");
          return prev;
        }
        if (currentQty >= availableQty) {
          toast.error("You have reached the available stock for this item");
          return prev;
        }
      }

      const nextItems = existing
        ? prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { ...product, quantity: 1 }];
      added = true;
      return nextItems;
    });

    if (added) {
      toast.success(`${product.name} added to cart`);
      setIsOpen(true);
    }
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
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
