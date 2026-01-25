import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Product } from "../types/domain";
import { toast } from "react-hot-toast";

export const useCatalog = (categoryId?: string, query?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      if (categoryId) {
        // Fix: Use getProducts with categoryId parameter because getCategoryProducts is not defined in the catalog service
        const data = await apiService.catalog.getProducts({ categoryId });
        setProducts(data);
      } else if (query) {
        const data = await apiService.catalog.getProducts({ q: query });
        setProducts(data);
      } else {
        const data = await apiService.catalog.getProducts({});
        setProducts(data);
      }
    } catch {
      toast.error("Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, [categoryId, query]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { products, loading, refresh: fetchCatalog };
};
