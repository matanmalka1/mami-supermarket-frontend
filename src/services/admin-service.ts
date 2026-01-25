import { apiClient } from "./api-client";
import type { Product } from "@/types/domain";
import {
  AdminSettings,
  InventoryCreateRequest,
  InventoryResponse,
  StockRequestStatus,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/admin-service";

// Endpoint map for easy backend contract swaps (do not guess endpoints)
const ADMIN_ENDPOINTS = {
  inventory: "/admin/inventory",
  productsSearch: "/catalog/products/search",
  adminProducts: "/admin/products",
  adminStockRequests: "/stock-requests/admin",
  adminBulkStockRequests: "/stock-requests/admin/bulk-review",
  settings: "/admin/settings",
  analyticsRevenue: "/admin/analytics/revenue",
  fleetStatus: "/admin/fleet/status",
  deliverySlots: "/admin/delivery-slots",
  audit: "/admin/audit",
};

export const adminService = {
  getInventory: () => apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.inventory),
  updateStock: (
    id: string,
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
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.productsSearch, { params }),
  updateProduct: (id: string, data: UpdateProductRequest) =>
    apiClient.patch<UpdateProductRequest, void>(
      `${ADMIN_ENDPOINTS.adminProducts}/${id}`,
      data,
    ),
  toggleProduct: (id: string, active: boolean) =>
    apiClient.patch<void, void>(
      `${ADMIN_ENDPOINTS.adminProducts}/${id}/toggle`,
      null,
      { params: { active } },
    ),
  createProduct: (data: CreateProductRequest) =>
    apiClient.post<CreateProductRequest, Product>(
      ADMIN_ENDPOINTS.adminProducts,
      data,
    ),
  createInventory: (data: InventoryCreateRequest) =>
    apiClient.post<InventoryCreateRequest, InventoryResponse>(
      ADMIN_ENDPOINTS.inventory,
      data,
    ),
  getStockRequests: (params?: Record<string, any>) =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.adminStockRequests, { params }),
  resolveStockRequest: (
    id: string,
    data: {
      status: StockRequestStatus;
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
      request_id: string;
      status: StockRequestStatus;
      approved_quantity?: number;
      rejection_reason?: string;
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
  getFleetStatus: () => apiClient.get<any, any>(ADMIN_ENDPOINTS.fleetStatus),
  getDeliverySlots: () =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.deliverySlots),
  getAuditLogs: (params?: Record<string, any>) =>
    apiClient.get<any[], any[]>(ADMIN_ENDPOINTS.audit, { params }),
};
