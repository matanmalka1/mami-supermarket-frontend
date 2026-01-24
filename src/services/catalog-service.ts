import { apiClient } from "./api-client";
import { Category, Product } from "../types/domain";

// Interfaces for catalog-service
export interface ProductSearchParams {
  category_id?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export const catalogService = {
  getHealth: () => apiClient.get<void, void>("/health"),
  getCategories: () =>
    apiClient.get<Category[], Category[]>("/catalog/categories"),
  getProduct: (id: string) =>
    apiClient.get<void, Product>(`/catalog/products/${id}`),
  getProducts: (params: ProductSearchParams) =>
    apiClient.get<Product[], Product[]>("/catalog/products/search", { params }),
  getFeatured: (limit = 4) =>
    apiClient.get<Product[], Product[]>("/catalog/products/featured", {
      params: { limit },
    }),
  getAutocomplete: (q: string) =>
    apiClient.get<Product[], Product[]>("/catalog/products/autocomplete", {
      params: { q, limit: 10 },
    }),
};
