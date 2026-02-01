import { apiClient } from "@/services/api-client";
import type {
  StockRequest,
  StockRequestCreate,
  StockRequestStatus,
} from "./types";

const BASE = "/stock-requests";

const toStockRequest = (dto: any): StockRequest => ({
  id: dto.id,
  productName: dto.product_name || dto.productName,
  sku: dto.sku,
  quantity: dto.quantity,
  priority: dto.priority,
  requester: dto.requester,
  status: dto.status,
  createdAt: dto.created_at || dto.createdAt,
});

export const stockRequestsService = {
  create: async (payload: StockRequestCreate): Promise<StockRequest> => {
    const data = await apiClient.post<any, any>(BASE, payload);
    return toStockRequest(data);
  },
  getMy: async (): Promise<StockRequest[]> => {
    const data = await apiClient.get<any[], any[]>(`${BASE}/my`);
    return Array.isArray(data) ? data.map(toStockRequest) : [];
  },
  getAdmin: async (): Promise<StockRequest[]> => {
    const data = await apiClient.get<any[], any[]>(`${BASE}/admin`);
    return Array.isArray(data) ? data.map(toStockRequest) : [];
  },
  getAdminById: async (requestId: number | string): Promise<StockRequest> => {
    const data = await apiClient.get<any, any>(`${BASE}/admin/${requestId}`);
    return toStockRequest(data);
  },
  resolve: async (
    requestId: number | string,
    status: StockRequestStatus,
  ): Promise<StockRequest> => {
    const data = await apiClient.patch<any, any>(
      `${BASE}/admin/${requestId}/resolve`,
      { status },
    );
    return toStockRequest(data);
  },
  bulkReview: async (
    requestIds: Array<number | string>,
    status: StockRequestStatus,
  ): Promise<
    { id: number | string; status: StockRequestStatus; error?: string }[]
  > => {
    const data = await apiClient.patch<any, any>(`${BASE}/admin/bulk-review`, {
      request_ids: requestIds,
      status,
    });
    // Bulk review returns per-item results, do not aggregate
    return Array.isArray(data)
      ? data.map((item: any) => ({
          id: item.id,
          status: item.status,
          error: item.error,
        }))
      : [];
  },
};
