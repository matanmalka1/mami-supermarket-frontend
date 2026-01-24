import { apiClient } from "./api-client";

// Endpoint map for easy backend contract swaps (do not guess endpoints)
const ADMIN_ENDPOINTS = {
  inventory: "/admin/inventory",
  productsSearch: "/catalog/products/search",
  adminProducts: "/admin/products",
  adminStockRequests: "/stock-requests/admin",
  adminBulkStockRequests: "/stock-requests/admin/bulk-review",
  settings: "/admin/settings",
  analyticsRevenue: "/admin/analytics/revenue",
};

export type AdminSettings = {
  delivery_min: number;
  delivery_fee: number;
  slots: string;
};

export type StockRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

// Interfaces for admin-service
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}
export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  category_id: string;
  description?: string;
}
export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  price?: number;
  category_id?: string;
}
export interface CreateBranchRequest {
  name: string;
  address: string;
}
export interface CreateDeliverySlotRequest {
  branch_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export const adminService = {
  getInventory: () => apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.inventory),
  updateStock: (id: string, data: { availableQuantity: number; reservedQuantity: number }) =>
    apiClient.patch<
      { availableQuantity: number; reservedQuantity: number },
      void
    >(`${ADMIN_ENDPOINTS.inventory}/${id}`, {
      available_quantity: data.availableQuantity,
      reserved_quantity: data.reservedQuantity,
    }),
  getProducts: (params?: Record<string, any>) =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.productsSearch, { params }),
  updateProduct: (id: string, data: UpdateProductRequest) =>
    apiClient.patch<UpdateProductRequest, void>(
      `${ADMIN_ENDPOINTS.adminProducts}/${id}`,
      data,
    ),
  createProduct: (data: CreateProductRequest) =>
    apiClient.post<CreateProductRequest, void>(ADMIN_ENDPOINTS.adminProducts, data),
  getStockRequests: (params?: Record<string, any>) =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.adminStockRequests, { params }),
  resolveStockRequest: (
    id: string,
    data: { status: StockRequestStatus; approvedQuantity?: number; rejectionReason?: string },
  ) =>
    apiClient.patch<typeof data, void>(
      `${ADMIN_ENDPOINTS.adminStockRequests}/${id}/resolve`,
      data,
    ),
  bulkResolveStockRequests: (
    items: { request_id: string; status: StockRequestStatus; approved_quantity?: number; rejection_reason?: string }[],
  ) =>
    apiClient.patch<{ items: any[] }, void>(
      ADMIN_ENDPOINTS.adminBulkStockRequests,
      { items },
    ),
  getSettings: () => apiClient.get<AdminSettings, AdminSettings>(ADMIN_ENDPOINTS.settings),
  updateSettings: (data: Partial<AdminSettings>) =>
    apiClient.put<Partial<AdminSettings>, AdminSettings>(ADMIN_ENDPOINTS.settings, data),
  getRevenueAnalytics: () =>
    apiClient.get<void, void>(ADMIN_ENDPOINTS.analyticsRevenue),
};
