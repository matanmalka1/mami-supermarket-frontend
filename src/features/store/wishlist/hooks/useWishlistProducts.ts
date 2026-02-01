import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { catalogService } from "@/domains/catalog/service";
import { Product } from "@/domains/catalog/types";
import { useWishlist } from "@/context/wishlist-context";

import type { WishlistItem } from "@/domains/wishlist/types";

export const useWishlistProducts = () => {
  const { items, removeWishlistItem, isLoading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Wait for wishlist to load
    if (wishlistLoading) {
      setLoading(true);
      return;
    }

    const ids = Array.from(new Set(items.map((item: WishlistItem) => item.id)));
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    Promise.allSettled(ids.map((id) => catalogService.getProduct(id)))
      .then((results) => {
        if (!active) return;
        const fulfilled = results
          .filter(
            (result): result is PromiseFulfilledResult<Product> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);
        const invalidIds: number[] = [];
        let otherError = false;
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            const code = (result.reason as any)?.code;
            if (code === "HTTP_404") {
              invalidIds.push(ids[index]);
            } else {
              otherError = true;
            }
          }
        });
        setProducts(fulfilled);
        if (invalidIds.length) {
          invalidIds.forEach((id) => removeWishlistItem(id));
        }
        if (invalidIds.length) {
          toast.error(`Removed ${invalidIds.length} unavailable wishlist item${invalidIds.length > 1 ? "s" : ""}`);
        } else if (otherError) {
          toast.error("Some wishlist items could not be loaded");
        }
      })
      .catch(() => {
        if (active) toast.error("Failed to load wishlist items");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [items, removeWishlistItem, wishlistLoading]);

  return {
    products,
    loading,
  };
};
