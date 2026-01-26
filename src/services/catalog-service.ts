import { apiClient } from "./api-client";
import { Category, Product } from "../types/domain";

// Interfaces for catalog-service
export interface ProductSearchParams {
  categoryId?: number;
  branchId?: number;
  q?: string;
  limit?: number;
  offset?: number;
}

export const catalogService = {
  getHealth: () => apiClient.get<void, void>("/health"),

  getCategories: () =>
    apiClient.get<Category[], Category[]>("/catalog/categories"),

  getProduct: (id: number) =>
    apiClient.get<void, Product>(`/catalog/products/${id}`),

  getProducts: (params: ProductSearchParams) =>
    apiClient.get<Product[], Product[]>("/catalog/products/search", { params }),

  getFeatured: (limit = 4) =>
    apiClient.get<Product[], Product[]>("/catalog/products/featured", {
      params: { limit },
    }),
    
  getAutocomplete: (
    q: string,
    options: { branchId?: number; limit?: number } = {},
  ) =>
    apiClient.get<Product[], Product[]>("/catalog/products/autocomplete", {
      params: {
        q,
        limit: options.limit ?? 10,
        branchId: options.branchId,
      },
    }),
};
