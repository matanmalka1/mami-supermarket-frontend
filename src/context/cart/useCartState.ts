import { useState, useCallback, useRef } from "react";
import { CartItem } from "../cart-context";
import { cartService } from "@/domains/cart/service";
import { mapBackendItems } from "./cart-operations";

export const useCartState = (isAuthenticated: boolean) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const productCacheRef = useRef<Map<number, any>>(new Map());

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.get();
      const mappedItems = mapBackendItems(
        response.items,
        productCacheRef.current,
      );
      setItems(mappedItems);
    } catch (error: any) {
      console.error("[CartContext] Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    items,
    setItems,
    isOpen,
    setIsOpen,
    loading,
    productCacheRef,
    fetchCart,
    total,
  };
};
