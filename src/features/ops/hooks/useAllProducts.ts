import { useState, useEffect } from "react";
import { apiClient } from "@/services/api-client";
import type { AdminProduct } from "@/domains/admin/types";

/**
 * Hook for fetching all products without delivery branch context
 * Useful for admin/ops interfaces
 */
export const useAllProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use admin products endpoint directly
        const data = await apiClient.get<AdminProduct[], AdminProduct[]>(
          "/admin/products",
          { params: { limit: 1000 } }
        );
        setProducts(data);
      } catch (err: any) {
        console.error("Failed to load products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
