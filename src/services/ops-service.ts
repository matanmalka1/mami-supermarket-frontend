import { apiClient } from "./api-client";
import { Order, OrderItem } from "../types/domain";
import { StockRequest } from "../types/ops";
import {
  UpdateItemStatusRequest,
  UpdateOrderStatusRequest,
  CreateStockRequest,
  GetOrdersParams,
  OpsAlert,
} from "../types/ops-service";

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

  updateOrderStatus: (oId: string, data: UpdateOrderStatusRequest) =>
    apiClient.patch<UpdateOrderStatusRequest, Order>(
      `/ops/orders/${oId}/status`,
      data,
    ),
  getOrder: (id: string) =>
    apiClient.get<Order, Order>(`/ops/orders/${id}`),
  updateItemStatus: (
    orderId: string,
    itemId: string,
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

  createBatch: (orderIds: string[]) =>
    apiClient.post<string[], { id: string }[]>("/ops/batches", {
      orderIds,
    }),
};
