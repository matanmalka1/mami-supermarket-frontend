import { useCallback } from "react";
import { apiService } from "../services/api";
import type { Product } from "../types/domain";
import { useAsyncResource } from "./useAsyncResource";
import { normalizeProductList } from "@/utils/products";

export const useCatalog = (categoryId?: number, query?: string) => {
  const fetchCatalog = useCallback(async () => {
    const payload = await (categoryId
      ? apiService.catalog.getProducts({ categoryId })
      : query
      ? apiService.catalog.getProducts({ q: query })
      : apiService.catalog.getProducts({}));
    return normalizeProductList(payload);
  }, [categoryId, query]);

  const { data: products, loading, refresh } = useAsyncResource<Product[]>(fetchCatalog, {
    initialData: [],
    errorMessage: "Failed to load catalog",
  });

  return { products, loading, refresh };
};
