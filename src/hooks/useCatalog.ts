import { useCallback } from "react";
import { apiService } from "../services/api";
import { Product } from "../types/domain";
import { useAsyncResource } from "./useAsyncResource";

export const useCatalog = (categoryId?: string, query?: string) => {
  const fetchCatalog = useCallback(async () => {
    if (categoryId) {
      // Fix: Use getProducts with categoryId parameter because getCategoryProducts is not defined in the catalog service
      return apiService.catalog.getProducts({ categoryId });
    }

    if (query) {
      return apiService.catalog.getProducts({ q: query });
    }

    return apiService.catalog.getProducts({});
  }, [categoryId, query]);

  const { data: products, loading, refresh } = useAsyncResource<Product[]>(fetchCatalog, {
    initialData: [],
    errorMessage: "Failed to load catalog",
  });

  return { products, loading, refresh };
};
