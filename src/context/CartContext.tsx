import React, { useEffect, useState, useCallback, useRef } from "react";
import { CartContext, CartItem } from "./cart-context";
import { cartService } from "@/domains/cart/service";
import { useAuth } from "@/hooks/useAuth";
import { mapBackendItems } from "./cart/cart-operations";
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from "./cart/cart-operations";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
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

  // Load cart on mount and when auth changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (product: any) => {
    if (!isAuthenticated) {
      return;
    }

    const success = await addItemToCart(
      product,
      items,
      productCacheRef.current,
    );
    if (success) {
      await fetchCart();
      setIsOpen(true);
    }
  };

  const removeItem = async (id: number | string) => {
    if (!isAuthenticated) return;

    const success = await removeItemFromCart(id, items);
    if (success) {
      await fetchCart();
    }
  };

  const updateQuantity = async (id: number | string, qty: number) => {
    if (!isAuthenticated) return;

    if (qty < 1) {
      return removeItem(id);
    }

    const success = await updateItemQuantity(id, qty, items);
    if (success) {
      await fetchCart();
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      await cartService.clear();
      setItems([]);
    } catch (error: any) {
      console.error("[CartContext] Failed to clear cart:", error);
      // Still clear local state even if backend call fails
      setItems([]);
    }
  };

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
