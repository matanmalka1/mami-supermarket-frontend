import { apiClient } from "@/services/api-client";
import { mapCategory, mapProduct } from "./service-mappers";
import type { CategoryDTO, ProductDTO } from "./service-dto";
import type { Category, Product } from "./types";
import type { Pagination } from "@/domains/pagination/types";

export const catalogPrefix = "/catalog";

export const buildCategoryResponse = async (params?: {
  limit?: number;
  offset?: number;
}) => {
  const { limit = 50, offset = 0 } = params || {};
  const data = await apiClient.get<CategoryDTO[], CategoryDTO[]>(
    `${catalogPrefix}/categories`,
    {
      params: { limit, offset },
    },
  );
  const items = Array.isArray(data) ? data.map(mapCategory) : [];
  const effectiveTotal = offset + items.length;
  const hasNext = items.length === limit;
  return {
    items,
    pagination: { total: effectiveTotal, limit, offset, hasNext },
  };
};

export const buildProductPagination = (
  data: ProductDTO[] | undefined,
  limit: number,
  offset: number,
): { items: Product[]; pagination: Pagination } => {
  const items = Array.isArray(data) ? data.map(mapProduct) : [];
  const effectiveTotal = offset + items.length;
  const hasNext = items.length === limit;
  return {
    items,
    pagination: { total: effectiveTotal, limit, offset, hasNext },
  };
};

export const buildFeaturedResponse = async (params?: {
  branchId?: number;
  limit?: number;
}) => {
  const { branchId, limit = 10 } = params || {};
  const data = await apiClient.get<ProductDTO[], ProductDTO[]>(
    `${catalogPrefix}/products/featured`,
    {
      params: { branchId, limit },
    },
  );
  const items = Array.isArray(data) ? data.map(mapProduct) : [];
  return items;
};
