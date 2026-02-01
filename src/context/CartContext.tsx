import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { CartContext, CartItem } from "./cart-context";
import { cartService } from "@/domains/cart/service";
import { useAuth } from "@/hooks/useAuth";

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

      // Map backend cart items to frontend format
      const mappedItems: CartItem[] = response.items.map((item) => {
        const productId =
          typeof item.productId === "string"
            ? parseInt(item.productId, 10)
            : item.productId;
        const cachedProduct = productCacheRef.current.get(productId);

        return {
          id: productId,
          name: cachedProduct?.name || `Product ${item.productId}`,
          price: item.unitPrice,
          image: cachedProduct?.imageUrl || cachedProduct?.image || "",
          quantity: item.quantity,
          unit: cachedProduct?.unit,
          availableQuantity: cachedProduct?.availableQuantity,
        };
      });

      setItems(mappedItems);
    } catch (error: any) {
      console.error("[CartContext] Failed to fetch cart:", error);
      // Don't show error toast on initial load
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
      toast.error("Please log in to add items to cart");
      return;
    }

    const availableQty =
      typeof product.availableQuantity === "number"
        ? Math.max(0, product.availableQuantity)
        : undefined;

    const existing = items.find((i) => i.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (availableQty !== undefined) {
      if (availableQty <= 0) {
        toast.error("This item is out of stock");
        return;
      }
      if (currentQty >= availableQty) {
        toast.error("You have reached the available stock for this item");
        return;
      }
    }

    try {
      // Cache product info for display
      const productId =
        typeof product.id === "string" ? parseInt(product.id, 10) : product.id;
      productCacheRef.current.set(productId, product);

      await cartService.addItem(productId, 1);
      await fetchCart(); // Refresh cart from backend
      toast.success(`${product.name} added to cart`);
      setIsOpen(true);
    } catch (error: any) {
      console.error("[CartContext] Failed to add item:", error);

      // Handle specific error codes for better UX
      if (error?.code === "OUT_OF_STOCK_DELIVERY_BRANCH") {
        toast.error(`${product.name} is currently out of stock for delivery`);
      } else if (error?.message?.toLowerCase().includes("out of stock")) {
        toast.error(`${product.name} is currently out of stock`);
      } else {
        toast.error(error?.message || "Failed to add item to cart");
      }
    }
  };

  const removeItem = async (id: number | string) => {
    if (!isAuthenticated) return;

    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    const item = items.find((i) => i.id === numericId);

    if (!item) return;

    // Find the backend cart item ID
    try {
      const response = await cartService.get();
      const backendItem = response.items.find((bi) => {
        const productId =
          typeof bi.productId === "string"
            ? parseInt(bi.productId, 10)
            : bi.productId;
        return productId === numericId;
      });

      if (backendItem && backendItem.id) {
        const itemId =
          typeof backendItem.id === "string"
            ? parseInt(backendItem.id, 10)
            : backendItem.id;
        await cartService.removeItem(itemId);
        await fetchCart();
      }
    } catch (error: any) {
      console.error("[CartContext] Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (id: number | string, qty: number) => {
    if (!isAuthenticated) return;

    if (qty < 1) {
      return removeItem(id);
    }

    const numericId = typeof id === "string" ? parseInt(id, 10) : id;

    try {
      const response = await cartService.get();
      const backendItem = response.items.find((bi) => {
        const productId =
          typeof bi.productId === "string"
            ? parseInt(bi.productId, 10)
            : bi.productId;
        return productId === numericId;
      });

      if (backendItem && backendItem.id) {
        const itemId =
          typeof backendItem.id === "string"
            ? parseInt(backendItem.id, 10)
            : backendItem.id;
        const productId =
          typeof backendItem.productId === "string"
            ? parseInt(backendItem.productId, 10)
            : backendItem.productId;
        await cartService.updateItem(itemId, productId, qty);
        await fetchCart();
      }
    } catch (error: any) {
      console.error("[CartContext] Failed to update quantity:", error);
      toast.error("Failed to update quantity");
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
