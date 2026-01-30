import { apiClient } from "@/services/api-client";
import type { Category, Product } from "./types";
import type { Pagination } from "@/domains/pagination/types";

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
  oldPrice?: number | null;
  unit?: string | null;
  nutritionalInfo?: Record<string, unknown> | null;
  isOrganic?: boolean;
  binLocation?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  categoryId: number;
  isActive: boolean;
  inStockAnywhere: boolean;
  inStockForBranch?: boolean | null;
  availableQuantity?: number | null;
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
  category: String(dto.categoryId),
  price: dto.price,
  oldPrice: dto.oldPrice ?? undefined,
  availableQuantity:
    typeof dto.availableQuantity === "number"
      ? Math.max(0, dto.availableQuantity)
      : dto.inStockAnywhere
      ? 1
      : 0,
  reservedQuantity: 0,
  status: dto.isActive ? "active" : "inactive",
  imageUrl: dto.imageUrl ?? "",
  binLocation: dto.binLocation ?? undefined,
  description: dto.description ?? undefined,
  unit: dto.unit ?? undefined,
});

const catalogPrefix = "/catalog";

const buildCategoryResponse = async (params?: {
  limit?: number;
  offset?: number;
}) => {
  const { limit = 50, offset = 0 } = params || {};
  const data = await apiClient.get<CategoryDTO[]>(
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

const buildFeaturedResponse = async (params?: {
  branchId?: number;
  limit?: number;
}) => {
  const { branchId, limit = 10 } = params || {};
  const data = await apiClient.get<ProductDTO[]>(
    `${catalogPrefix}/products/featured`,
    {
      params: { branchId, limit },
    },
  );
  const items = Array.isArray(data) ? data.map(mapProduct) : [];
  return items;
};

export const catalogService = {
  /**
   * List all categories (paginated)
   */
  async listCategories(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ items: Category[]; pagination: Pagination }> {
    return buildCategoryResponse(params);
  },
  async getCategories(params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ items: Category[]; pagination: Pagination }> {
    return buildCategoryResponse(params);
  },

  /**
   * List products in a category (paginated, optional branch)
   */
  async listCategoryProducts(
    categoryId: number,
    params?: { branchId?: number; limit?: number; offset?: number },
  ): Promise<{ items: Product[]; pagination: Pagination }> {
    const { branchId, limit = 50, offset = 0 } = params || {};
    const data = await apiClient.get<ProductDTO[]>(
      `${catalogPrefix}/categories/${categoryId}/products`,
      {
        params: { branchId, limit, offset },
      },
    );
    const items = Array.isArray(data) ? data.map(mapProduct) : [];
    const effectiveTotal = offset + items.length;
    const hasNext = items.length === limit;
    return {
      items,
      pagination: { total: effectiveTotal, limit, offset, hasNext },
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
    const data = await apiClient.get<ProductDTO>(
      `${catalogPrefix}/products/${productId}`,
      {
        params: { branchId },
      },
    );
    return mapProduct(data);
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
    const data = await apiClient.get<ProductDTO[]>(
      `${catalogPrefix}/products/search`,
      {
        params: { q, limit, offset, minPrice, maxPrice, sort },
      },
    );
    const items = Array.isArray(data) ? data.map(mapProduct) : [];
    const effectiveTotal = offset + items.length;
    const hasNext = items.length === limit;
    return {
      items,
      pagination: { total: effectiveTotal, limit, offset, hasNext },
    };
  },
  async getProducts(params?: {
    categoryId?: number;
    q?: string;
    limit?: number;
    offset?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    branchId?: number;
  }): Promise<{ items: Product[]; pagination: Pagination }> {
    if (params?.categoryId) {
      const { categoryId, limit, offset, branchId } = params;
      return this.listCategoryProducts(categoryId, {
        branchId,
        limit,
        offset,
      });
    }
    return this.searchProducts({
      q: params?.q ?? "",
      limit: params?.limit,
      offset: params?.offset,
      minPrice: params?.minPrice,
      maxPrice: params?.maxPrice,
      sort: params?.sort,
    });
  },
  async listFeaturedProducts(params?: {
    branchId?: number;
    limit?: number;
  }): Promise<Product[]> {
    return buildFeaturedResponse(params);
  },
  async getFeatured(limit?: number): Promise<Product[]> {
    return buildFeaturedResponse({ limit });
  },

  /**
   * Autocomplete products (query, limit)
   */
  async autocompleteProducts(params: {
    q: string;
    limit?: number;
  }): Promise<Array<{ id: number; name: string }>> {
    const { q, limit = 10 } = params;

    const { data } = await apiClient.get<{
      items: Array<{ id: number; name: string }>;
    }>(`${catalogPrefix}/products/autocomplete`, {
      params: { q, limit },
    });
    return Array.isArray(data.items) ? data.items : [];
  },

  /**
   * Get product reviews (always empty for now)
   */
  async getProductReviews(productId: number): Promise<{ items: any[] }> {
    const { data } = await apiClient.get<any>(
      `${catalogPrefix}/products/${productId}/reviews`,
    );
    return { items: data.items ?? [] };
  },
};
