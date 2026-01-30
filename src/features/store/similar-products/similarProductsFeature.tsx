import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { extractArrayPayload } from "@/utils/api-response";

type UseSimilarProductsOptions = { category?: string; excludeId?: number };

export function useSimilarProducts({
  category,
  excludeId,
}: UseSimilarProductsOptions) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchSimilar = async (nextOffset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const { items: list } = await apiService.catalog.searchProducts({
        limit: 8,
        offset: nextOffset,
        q: category || undefined,
      });
      const normalizedCategory = category?.trim().toLowerCase();
      const filtered = list.filter((p: any) => {
        
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
  };

  useEffect(() => {fetchSimilar(0)}, [category, excludeId]);

  return { items, loading, error, offset, fetchSimilar };
}
