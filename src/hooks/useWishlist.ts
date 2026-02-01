import { useCallback, useEffect, useState } from "react";
import { wishlistService } from "@/domains/wishlist/service";
import type { WishlistItem } from "@/domains/wishlist/types";
import { toast } from "react-hot-toast";

export type { WishlistItem };

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from backend on mount
  useEffect(() => {
    let mounted = true;

    const loadWishlist = async () => {
      try {
        const response = await wishlistService.list();
        if (mounted) {
          const wishlistItems = response.items.map((item) => ({
            id: item.productId,
            note: undefined,
            priority: undefined,
          }));
          setItems(wishlistItems);
        }
      } catch (error) {
        // Silently fail - user might not be logged in
        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleWishlist = useCallback(
    async (productId: number) => {
      const isCurrentlyWishlisted = items.some((item) => item.id === productId);

      // Optimistic update
      setItems((prev) =>
        isCurrentlyWishlisted
          ? prev.filter((item) => item.id !== productId)
          : [...prev, { id: productId }],
      );

      try {
        if (isCurrentlyWishlisted) {
          await wishlistService.remove(productId);
        } else {
          await wishlistService.add(productId);
        }
      } catch (error) {
        // Revert on failure
        setItems((prev) =>
          isCurrentlyWishlisted
            ? [...prev, { id: productId }]
            : prev.filter((item) => item.id !== productId),
        );
        toast.error("Failed to update wishlist");
        throw error;
      }
    },
    [items],
  );

  const isWishlisted = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items],
  );

  const updateWishlistItem = useCallback(
    (productId: number, changes: Partial<Omit<WishlistItem, "id">>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, ...changes } : item,
        ),
      );
    },
    [],
  );

  const removeWishlistItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  return {
    items,
    toggleWishlist,
    isWishlisted,
    updateWishlistItem,
    removeWishlistItem,
    isLoading,
  };
};
