import { useCallback } from "react";
import { catalogService } from "@/domains/catalog/service";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { normalizeProductList } from "@/utils/products";
import type { Product } from "@/domains/catalog/types";

export const useCatalog = (categoryId?: number, query?: string) => {
  const fetchCatalog = useCallback(async () => {
    const payload = categoryId
      ? await catalogService.getProducts({ categoryId })
      : query
      ? await catalogService.getProducts({ q: query })
      : await catalogService.getProducts({});
    return normalizeProductList(payload);
  }, [categoryId, query]);

  const { data: products, loading, refresh } = useAsyncResource<Product[]>(
    fetchCatalog,
    {
      initialData: [],
      errorMessage: "Failed to load catalog",
    },
  );

  return { products, loading, refresh };
};
