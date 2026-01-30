import { apiClient } from "@/services/api-client";
import type {
  AdminProduct,
  AdminSettings,
  AdminStockRequestStatus,
  AdminInventoryCreateRequest,
  AdminInventoryResponse,
  AdminCreateProductRequest,
  AdminUpdateProductRequest,
} from "./types";

const ADMIN_ENDPOINTS = {
  inventory: "/admin/inventory",
  productsSearch: "/catalog/products/search",
  adminProducts: "/admin/products",
  adminStockRequests: "/stock-requests/admin",
  adminBulkStockRequests: "/stock-requests/admin/bulk-review",
  settings: "/admin/settings",
  analyticsRevenue: "/admin/analytics/revenue",
  deliverySlots: "/admin/delivery-slots",
  audit: "/admin/audit",
};

export const adminService = {
  getInventory: () =>
    apiClient.get<AdminInventoryResponse[], AdminInventoryResponse[]>(
      ADMIN_ENDPOINTS.inventory,
    ),
  updateStock: (
    id: number,
    data: { availableQuantity: number; reservedQuantity: number },
  ) =>
    apiClient.patch<
      { availableQuantity: number; reservedQuantity: number },
      void
    >(`${ADMIN_ENDPOINTS.inventory}/${id}`, {
      available_quantity: data.availableQuantity,
      reserved_quantity: data.reservedQuantity,
    }),
  getProducts: (params?: Record<string, any>) =>
    apiClient.get<AdminProduct[], AdminProduct[]>(
      ADMIN_ENDPOINTS.productsSearch,
      { params },
    ),
  updateProduct: (id: number, data: AdminUpdateProductRequest) =>
    apiClient.patch<AdminUpdateProductRequest, void>(
      `${ADMIN_ENDPOINTS.adminProducts}/${id}`,
      data,
    ),
  toggleProduct: (id: number, active: boolean) =>
    apiClient.patch<void, void>(
      `${ADMIN_ENDPOINTS.adminProducts}/${id}/toggle`,
      null,
      { params: { active } },
    ),
  createProduct: (data: AdminCreateProductRequest) =>
    apiClient.post<AdminCreateProductRequest, AdminProduct>(
      ADMIN_ENDPOINTS.adminProducts,
      data,
    ),
  createInventory: (data: AdminInventoryCreateRequest) =>
    apiClient.post<AdminInventoryCreateRequest, AdminInventoryResponse>(
      ADMIN_ENDPOINTS.inventory,
      data,
    ),
  getStockRequests: (params?: Record<string, any>) =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.adminStockRequests, { params }), // TODO: Replace any with AdminStockRequest[] if shape is confirmed
  resolveStockRequest: (
    id: number,
    data: {
      status: AdminStockRequestStatus;
      approvedQuantity?: number;
      rejectionReason?: string;
    },
  ) =>
    apiClient.patch<typeof data, void>(
      `${ADMIN_ENDPOINTS.adminStockRequests}/${id}/resolve`,
      data,
    ),
  bulkResolveStockRequests: (
    items: {
      requestId: number;
      status: AdminStockRequestStatus;
      approvedQuantity?: number;
      rejectionReason?: string;
    }[],
  ) =>
    apiClient.patch<{ items: any[] }, void>(
      ADMIN_ENDPOINTS.adminBulkStockRequests,
      { items },
    ),
  getSettings: () =>
    apiClient.get<AdminSettings, AdminSettings>(ADMIN_ENDPOINTS.settings),
  updateSettings: (data: Partial<AdminSettings>) =>
    apiClient.put<Partial<AdminSettings>, AdminSettings>(
      ADMIN_ENDPOINTS.settings,
      data,
    ),
  getRevenueAnalytics: () =>
    apiClient.get<any, any>(ADMIN_ENDPOINTS.analyticsRevenue),
  getDeliverySlots: () =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.deliverySlots),
  updateDeliverySlot: (
    id: number,
    data: {
      day_of_week?: number;
      start_time?: string;
      end_time?: string;
      branch_id?: number;
    },
  ) =>
    apiClient.patch<typeof data, void>(
      `${ADMIN_ENDPOINTS.deliverySlots}/${id}`,
      data,
    ),
  toggleDeliverySlot: (id: number, active: boolean) =>
    apiClient.patch<void, void>(
      `${ADMIN_ENDPOINTS.deliverySlots}/${id}/toggle`,
      null,
      { params: { active } },
    ),
  getAuditLogs: (params?: Record<string, any>) =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.audit, { params }),
};
