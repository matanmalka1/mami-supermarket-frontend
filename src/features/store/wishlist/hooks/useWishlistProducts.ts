import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { catalogService } from "@/domains/catalog/service";
import { Product } from "@/types/domain";
import { useWishlist } from "@/hooks/useWishlist";

import type { WishlistItem } from "@/hooks/useWishlist";

export const useWishlistProducts = () => {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
        setProducts(fulfilled);
        if (results.some((result) => result.status === "rejected")) {
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
  }, [items]);

  return {
    products,
    loading,
  };
};
