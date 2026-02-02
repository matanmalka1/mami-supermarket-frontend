import { useCallback } from "react";
import { CartItem } from "../cart-context";
import { cartService } from "@/domains/cart/service";
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from "./cart-operations";

interface UseCartActionsParams {
  isAuthenticated: boolean;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  productCache: React.MutableRefObject<Map<number, any>>;
  fetchCart: () => Promise<void>;
}

export const useCartActions = ({
  isAuthenticated,
  items,
  setItems,
  productCache,
  fetchCart,
}: UseCartActionsParams) => {
  const addItem = useCallback(
    async (product: any) => {
      if (!isAuthenticated) {
        return;
      }

      // Optimistic update - update UI immediately
      const productId =
        typeof product.id === "number" ? product.id : Number(product.id);
      const existing = items.find((i) => i.id === productId);

      if (existing) {
        // Increment existing item
        setItems((prev) =>
          prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image || product.imageUrl || "",
          quantity: 1,
          unit: product.unit,
          availableQuantity: product.availableQuantity,
        };
        setItems((prev) => [...prev, newItem]);
      }

      // Cache product data
      productCache.current.set(productId, product);

      // Sync with backend in background
      const success = await addItemToCart(product, items, productCache.current);

      if (!success) {
        // Revert optimistic update on failure
        await fetchCart();
      }
    },
    [isAuthenticated, items, setItems, productCache, fetchCart],
  );

  const removeItem = useCallback(
    async (id: number | string) => {
      if (!isAuthenticated) return;

      const numericId = typeof id === "number" ? id : Number(id);
      const previousItems = items;

      // Optimistic update - remove immediately
      setItems((prev) => prev.filter((item) => item.id !== numericId));

      // Sync with backend
      const success = await removeItemFromCart(id);

      if (!success) {
        // Revert on failure
        setItems(previousItems);
      }
    },
    [isAuthenticated, items, setItems],
  );

  const updateQuantity = useCallback(
    async (id: number | string, qty: number) => {
      if (!isAuthenticated) return;

      if (qty < 1) {
        return removeItem(id);
      }

      const numericId = typeof id === "number" ? id : Number(id);
      const previousItems = items;

      // Optimistic update - update quantity immediately
      setItems((prev) =>
        prev.map((item) =>
          item.id === numericId ? { ...item, quantity: qty } : item,
        ),
      );

      // Sync with backend
      const success = await updateItemQuantity(id, qty);

      if (!success) {
        // Revert on failure
        setItems(previousItems);
      }
    },
    [isAuthenticated, items, setItems, removeItem],
  );

  const clearCart = useCallback(async () => {
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
  }, [isAuthenticated, setItems]);

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};
