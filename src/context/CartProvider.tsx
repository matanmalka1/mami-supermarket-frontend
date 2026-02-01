import React, { useEffect } from "react";
import { CartContext } from "./cart-context";
import { useAuth } from "@/hooks/useAuth";
import { useCartState } from "./cart/useCartState";
import { useCartActions } from "./cart/useCartActions";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  const {
    items,
    setItems,
    isOpen,
    setIsOpen,
    productCacheRef,
    fetchCart,
    total,
  } = useCartState(isAuthenticated);

  const { addItem, removeItem, updateQuantity, clearCart } = useCartActions({
    isAuthenticated,
    items,
    setItems,
    productCache: productCacheRef,
    fetchCart,
  });

  // Load cart on mount and when auth changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
