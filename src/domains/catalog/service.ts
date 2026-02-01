import { apiClient } from "@/services/api-client";
import type { Category, Product } from "./types";
import type { Pagination } from "@/domains/pagination/types";
import type { CategoryDTO, ProductDTO } from "./service-dto";
import { mapCategory, mapProduct } from "./service-mappers";
import {
  buildCategoryResponse,
  buildProductPagination,
  buildFeaturedResponse,
  catalogPrefix,
} from "./service-helpers";

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

  /**
   * List products in a category (paginated, optional branch)
   */
  async listCategoryProducts(
    categoryId: number,
    params?: { branchId?: number; limit?: number; offset?: number },
  ): Promise<{ items: Product[]; pagination: Pagination }> {
    const { branchId, limit = 50, offset = 0 } = params || {};
    const data = await apiClient.get<ProductDTO[], ProductDTO[]>(
      `${catalogPrefix}/categories/${categoryId}/products`,
      {
        params: { branchId, limit, offset },
      },
    );
    return buildProductPagination(data, limit, offset);
  },

  /**
   * Get a single product by ID (optional branch)
   */
  async getProduct(
    productId: number,
    params?: { branchId?: number },
  ): Promise<Product> {
    const { branchId } = params || {};
    const data = await apiClient.get<ProductDTO, ProductDTO>(
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
    branchId?: number;
  }): Promise<{ items: Product[]; pagination: Pagination }> {
    const {
      q,
      limit = 50,
      offset = 0,
      minPrice,
      maxPrice,
      sort,
      branchId,
    } = params;
    const data = await apiClient.get<ProductDTO[], ProductDTO[]>(
      `${catalogPrefix}/products/search`,
      {
        params: { q, limit, offset, minPrice, maxPrice, sort, branchId },
      },
    );
    return buildProductPagination(data, limit, offset);
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
      branchId: params?.branchId,
    });
  },
  async listFeaturedProducts(params?: {
    branchId?: number;
    limit?: number;
  }): Promise<Product[]> {
    return buildFeaturedResponse(params);
  },

  /**
   * Autocomplete products (query, limit)
   */
  async autocompleteProducts(params: {
    q: string;
    limit?: number;
  }): Promise<Array<{ id: number; name: string }>> {
    const { q, limit = 10 } = params;

    const data = await apiClient.get<
      { items: Array<{ id: number; name: string }> },
      { items: Array<{ id: number; name: string }> }
    >(`${catalogPrefix}/products/autocomplete`, {
      params: { q, limit },
    });
    return Array.isArray(data.items) ? data.items : [];
  },

  /**
   * Get product reviews (always empty for now)
   */
  async getProductReviews(productId: number): Promise<{ items: any[] }> {
    const data = await apiClient.get<{ items?: any[] }, { items?: any[] }>(
      `${catalogPrefix}/products/${productId}/reviews`,
    );
    return { items: data.items ?? [] };
  },
};
