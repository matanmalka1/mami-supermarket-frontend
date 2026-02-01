import { useCallback } from "react";
import { catalogService } from "@/domains/catalog/service";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { normalizeProductList } from "@/utils/products";
import { useDeliveryBranch } from "@/features/store/hooks/useDeliveryBranch";
import type { Product } from "@/domains/catalog/types";

export const useCatalog = (categoryId?: number, query?: string) => {
  const { deliveryBranchId } = useDeliveryBranch();

  const fetchCatalog = useCallback(async () => {
    const payload = categoryId
      ? await catalogService.getProducts({
          categoryId,
          branchId: deliveryBranchId,
        })
      : query
        ? await catalogService.getProducts({
            q: query,
            branchId: deliveryBranchId,
          })
        : await catalogService.getProducts({ branchId: deliveryBranchId });
    const products = normalizeProductList(payload);
    return categoryId
      ? products.filter(
          (p: any) =>
            Number(p.id) === Number(categoryId) ||
            Number(p.categoryId) === Number(categoryId),
        )
      : products;
  }, [categoryId, query, deliveryBranchId]);

  const {
    data: products,
    loading,
    refresh,
  } = useAsyncResource<Product[]>(fetchCatalog, {
    initialData: [],
    errorMessage: "Failed to load catalog",
  });

  return { products, loading, refresh };
};
