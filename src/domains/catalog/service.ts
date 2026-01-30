import { apiClient } from "@/services/api-client";
import type { Category, Product } from "./types";
import type { Pagination } from "@/types/api";

// --- DTO Types ---
export interface CategoryDTO {
  id: number;
  name: string;
  icon_slug?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export interface ProductDTO {
  id: number;
  name: string;
  sku: string;
  price: number;
  old_price?: number | null;
  unit?: string | null;
  nutritional_info?: Record<string, unknown> | null;
  is_organic?: boolean;
  bin_location?: string | null;
  image_url?: string | null;
  description?: string | null;
  category_id: number;
  is_active: boolean;
  in_stock_anywhere: boolean;
  in_stock_for_branch?: boolean | null;
}

export interface PaginationDTO {
  total: number;
  limit: number;
  offset: number;
  has_next?: boolean;
}

// --- Mapping Functions ---

const mapCategory = (dto: CategoryDTO): Category => ({
  id: dto.id,
  name: dto.name,
  icon: dto.icon_slug ?? undefined,
  description: dto.description ?? undefined,
});

const mapProduct = (dto: ProductDTO): Product => ({
  id: dto.id,
  name: dto.name,
  sku: dto.sku,
  category: String(dto.category_id),
  price: dto.price,
  oldPrice: dto.old_price ?? undefined,
  availableQuantity: dto.in_stock_anywhere ? 1 : 0,
  reservedQuantity: 0,
  status: dto.is_active ? "active" : "inactive",
  imageUrl: dto.image_url ?? "",
  binLocation: dto.bin_location ?? undefined,
  description: dto.description ?? undefined,
  unit: dto.unit ?? undefined,
});

export const catalogService = {
  /**
   * List all categories (paginated)
   */
  async listCategories(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ items: Category[]; pagination: Pagination }> {
    const { limit = 50, offset = 0 } = params || {};
    const response = await apiClient.get<{
      items: CategoryDTO[];
      total: number;
      limit: number;
      offset: number;
      has_next?: boolean;
    }>("/categories", {
      params: { limit, offset },
    });
    const data = response.data;
    return {
      items: Array.isArray(data.items) ? data.items.map(mapCategory) : [],
      pagination: {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        hasNext:
          typeof data.has_next === "boolean"
            ? data.has_next
            : data.total > data.offset + data.limit,
      },
    };
  },

  /**
   * List products in a category (paginated, optional branch)
   */
  async listCategoryProducts(
    categoryId: number,
    params?: { branchId?: number; limit?: number; offset?: number },
  ): Promise<{ items: Product[]; pagination: Pagination }> {
    const { branchId, limit = 50, offset = 0 } = params || {};
    const data = await apiClient.get<{
      items: ProductDTO[];
      total: number;
      limit: number;
      offset: number;
      has_next?: boolean;
    }>(`/categories/${categoryId}/products`, {
      params: { branchId, limit, offset },
    });
    return {
      items: Array.isArray(data.items) ? data.items.map(mapProduct) : [],
      pagination: {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        hasNext:
          typeof data.has_next === "boolean"
            ? data.has_next
            : data.total > data.offset + data.limit,
      },
    };
  },

  /**
   * Get a single product by ID (optional branch)
   */
  async getProduct(
    productId: number,
    params?: { branchId?: number },
  ): Promise<Product> {
    const { branchId } = params || {};
    const raw = await apiClient.get<ProductDTO>(`/products/${productId}`, {
      params: { branchId },
    });
    return mapProduct(raw);
  },

  /**
   * Search products (query, price, sort, pagination)
   */
  async searchProducts(params: {
    q?: string;
    limit?: number;
    offset?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<{ items: Product[]; pagination: Pagination }> {
    const { q, limit = 50, offset = 0, minPrice, maxPrice, sort } = params;
    const data = await apiClient.get<{
      items: ProductDTO[];
      total: number;
      limit: number;
      offset: number;
      has_next?: boolean;
    }>("/products/search", {
      params: { q, limit, offset, minPrice, maxPrice, sort },
    });
    return {
      items: Array.isArray(data.items) ? data.items.map(mapProduct) : [],
      pagination: {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        hasNext:
          typeof data.has_next === "boolean"
            ? data.has_next
            : data.total > data.offset + data.limit,
      },
    };
  },
  async listFeaturedProducts(params?: {
    branchId?: number;
    limit?: number;
  }): Promise<Product[]> {
    const { branchId, limit = 10 } = params || {};
    const data = await apiClient.get<{ items: ProductDTO[] }>(
      "/products/featured",
      {
        params: { branchId, limit },
      },
    );
    return Array.isArray(data.items) ? data.items.map(mapProduct) : [];
  },

  /**
   * Autocomplete products (query, limit)
   */
  async autocompleteProducts(params: {
    q: string;
    limit?: number;
  }): Promise<Array<{ id: number; name: string }>> {
    const { q, limit = 10 } = params;
    const data = await apiClient.get<{
      items: Array<{ id: number; name: string }>;
    }>("/products/autocomplete", {
      params: { q, limit },
    });
    return Array.isArray(data.items) ? data.items : [];
  },

  /**
   * Get product reviews (always empty for now)
   */
  async getProductReviews(productId: number): Promise<{ items: any[] }> {
    const data = await apiClient.get<any>(`/products/${productId}/reviews`);
    return { items: data.items ?? [] };
  },
};
