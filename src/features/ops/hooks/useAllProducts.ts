import { useState, useEffect } from "react";
import { catalogService } from "@/domains/catalog/service";
import type { Product } from "@/domains/catalog/types";

/**
 * Hook for fetching all products without delivery branch context
 * Useful for admin/ops interfaces
 */
export const useAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await catalogService.searchProducts({
          limit: 200,
        });

        setProducts(result.items);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
