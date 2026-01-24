import { apiClient } from "./api-client";

// Endpoint map for easy backend contract swaps (do not guess endpoints)
const ADMIN_ENDPOINTS = {
  inventory: "/admin/inventory",
  products: "/catalog/products/search",
  stockRequests: "/ops/stock-requests",
  settings: "/admin/settings",
  analyticsRevenue: "/admin/analytics/revenue",
};

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
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.products, { params }),
  updateProduct: (id: string, data: UpdateProductRequest) =>
    apiClient.patch<UpdateProductRequest, void>(
      `${ADMIN_ENDPOINTS.products}/${id}`,
      data,
    ),
  createProduct: (data: CreateProductRequest) =>
    apiClient.post<CreateProductRequest, void>(ADMIN_ENDPOINTS.products, data),
  getStockRequests: () =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.stockRequests),
  resolveStockRequest: (id: string, status: "APPROVED" | "REJECTED") =>
    apiClient.patch<{ status: string }, void>(
      `${ADMIN_ENDPOINTS.stockRequests}/${id}/resolve`,
      { status },
    ),
  getSettings: () => apiClient.get<void, void>(ADMIN_ENDPOINTS.settings),
  updateSettings: (data: Record<string, any>) =>
    apiClient.put<Record<string, any>, void>(ADMIN_ENDPOINTS.settings, data),
  getRevenueAnalytics: () =>
    apiClient.get<void, void>(ADMIN_ENDPOINTS.analyticsRevenue),
};
