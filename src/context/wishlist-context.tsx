import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { wishlistService } from "@/domains/wishlist/service";
import type { WishlistItem } from "@/domains/wishlist/types";
import { toast } from "react-hot-toast";

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  updateWishlistItem: (
    productId: number,
    changes: Partial<Omit<WishlistItem, "id">>,
  ) => void;
  removeWishlistItem: (productId: number) => void;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    try {
      const response = await wishlistService.list();
      const wishlistItems = response.items.map((item) => ({
        id: item.productId,
        note: undefined,
        priority: undefined,
      }));
      setItems(wishlistItems);
    } catch (_err) {
      console.error("Failed to load wishlist:", _err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

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
      } catch (_err) {
        console.error("Failed to update wishlist:", _err);
        // Revert on failure
        setItems((prev) =>
          isCurrentlyWishlisted
            ? [...prev, { id: productId }]
            : prev.filter((item) => item.id !== productId),
        );
        toast.error("Failed to update wishlist");
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

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        toggleWishlist,
        isWishlisted,
        updateWishlistItem,
        removeWishlistItem,
        refresh: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
