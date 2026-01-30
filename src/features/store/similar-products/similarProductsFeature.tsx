import { useEffect, useState, useCallback } from "react";
import { catalogService } from "@/domains/catalog/service";
import type { Product } from "@/domains/catalog/types";

type UseSimilarProductsOptions = { category?: string; excludeId?: number };

export function useSimilarProducts({
  category,
  excludeId,
}: UseSimilarProductsOptions) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchSimilar = useCallback(
    async (nextOffset = 0) => {
      setLoading(true);
      setError(null);
      try {
        const { items: list = [] } = await catalogService.getProducts({
          limit: 8,
          offset: nextOffset,
          q: category?.trim() || undefined,
        });
        const normalizedCategory = category?.trim().toLowerCase();
        const filtered = list.filter((p) => {
          if (excludeId && p.id === excludeId) return false;
          if (!normalizedCategory) return true;
          return p.category?.toLowerCase() === normalizedCategory;
        });
        setItems(filtered);
        setOffset(nextOffset);
      } catch (err: any) {
        setError(err.message || "Failed to load recommendations");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [category, excludeId],
  );

  useEffect(() => {
    fetchSimilar(0);
  }, [fetchSimilar]);

  return { items, loading, error, offset, fetchSimilar };
}
