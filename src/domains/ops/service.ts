import { apiClient } from "@/services/api-client";
import { Order, OrderItem } from "@/types/domain";
import { StockRequest } from "@/types/ops";
import type {
  UpdateItemStatusRequest,
  UpdateOrderStatusRequest,
  GetOrdersParams,
} from "@/domains/ops/types";
import type { CreateStockRequest } from "@/domains/stock-requests/types";
import type { OpsAlert } from "@/domains/notifications/types";

export const opsService = {
  getOrders: (params?: GetOrdersParams) => {
    const { status, dateFrom, dateTo, limit = 50, offset = 0 } = params || {};
    const filteredParams: Record<string, string | number> = {};
    if (status) filteredParams.status = status;
    if (dateFrom) filteredParams.dateFrom = dateFrom;
    if (dateTo) filteredParams.dateTo = dateTo;
    if (typeof limit === "number" && limit >= 1 && limit <= 200)
      filteredParams.limit = limit;
    if (typeof offset === "number" && offset >= 0)
      filteredParams.offset = offset;
    return apiClient.get<Order[], Order[]>("/ops/orders", {
      params: filteredParams,
    });
  },

  updateOrderStatus: (oId: number, data: UpdateOrderStatusRequest) =>
    apiClient.patch<UpdateOrderStatusRequest, Order>(
      `/ops/orders/${oId}/status`,
      data,
    ),
  getOrder: (id: number) => apiClient.get<Order, Order>(`/ops/orders/${id}`),
  updateItemStatus: (
    orderId: number,
    itemId: number,
    data: UpdateItemStatusRequest,
  ) =>
    apiClient.patch<UpdateItemStatusRequest, OrderItem>(
      `/ops/orders/${orderId}/items/${itemId}/picked-status`,
      data,
    ),
  getPerformance: () => apiClient.get<any, any>("/ops/performance"),
  getAlerts: () => apiClient.get<OpsAlert[], OpsAlert[]>("/ops/alerts"),

  getStockRequests: () =>
    apiClient.get<StockRequest[], StockRequest[]>("/ops/stock-requests"),

  createStockRequest: (data: CreateStockRequest) =>
    apiClient.post<CreateStockRequest, StockRequest>(
      "/ops/stock-requests",
      data,
    ),

  createBatch: (orderIds: number[]) =>
    apiClient.post<number[], { id: number }[]>("/ops/batches", {
      orderIds,
    }),
};
