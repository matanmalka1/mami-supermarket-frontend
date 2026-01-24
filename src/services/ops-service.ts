import { apiClient } from "./api-client";
import { Order, OrderItem } from "../types/domain";
import { StockRequest } from "../types/ops";

// Interfaces for ops-service
export interface UpdateItemStatusRequest {
  picked_status: string;
  reason?: string;
  replacement_product_id?: string;
}
export interface UpdateOrderStatusRequest {
  status: string;
}
export interface CreateStockRequest {
  branch_id: string;
  product_id: string;
  quantity: number;
  request_type: string;
}

export interface GetOrdersParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export const opsService = {
  getOrders: (params?: GetOrdersParams) => {
    const {
      status,
      dateFrom,
      dateTo,
      limit = 50,
      offset = 0,
    } = params || {};
    const filteredParams: Record<string, string | number> = {};
    if (status) filteredParams.status = status;
    if (dateFrom) filteredParams.dateFrom = dateFrom;
    if (dateTo) filteredParams.dateTo = dateTo;
    if (typeof limit === "number" && limit >= 1 && limit <= 200) filteredParams.limit = limit;
    if (typeof offset === "number" && offset >= 0) filteredParams.offset = offset;
    return apiClient.get<Order[], Order[]>("/ops/orders", {
      params: filteredParams,
    });
  },

  getOrder: (id: string) => apiClient.get<Order, Order>(`/ops/orders/${id}`),

  createBatch: (ids: string[]) =>
    apiClient.post<{ orderIds: string[] }, void>("/ops/batches", {
      orderIds: ids,
    }),

  updateItemStatus: (oId: string, iId: string, data: UpdateItemStatusRequest) =>
    apiClient.patch<UpdateItemStatusRequest, OrderItem>(
      `/ops/orders/${oId}/items/${iId}/picked-status`,
      data,
    ),

  updateOrderStatus: (oId: string, data: UpdateOrderStatusRequest) =>
    apiClient.patch<UpdateOrderStatusRequest, Order>(
      `/ops/orders/${oId}/status`,
      data,
    ),
  getPerformance: () => apiClient.get<any, any>("/ops/performance"),

  getStockRequests: () =>
    apiClient.get<StockRequest[], StockRequest[]>("/ops/stock-requests"),

  createStockRequest: (data: CreateStockRequest) =>
    apiClient.post<CreateStockRequest, StockRequest>(
      "/ops/stock-requests",
      data,
    ),

  getWarehouseMap: () => apiClient.get<any, any>("/ops/map"),
};
