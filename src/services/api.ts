import { authService } from "./auth-service";
import { opsService } from "./ops-service";
import { adminService } from "./admin-service";
import { catalogService } from "./catalog-service";
import { checkoutService } from "./checkout-service";
import { apiClient } from "./api-client";
import { Order } from "../types/domain";
import { ApiEnvelope } from "../types/api";

export const apiService = {
  auth: authService,
  ops: opsService,
  admin: adminService,
  catalog: catalogService,
  checkout: checkoutService,
  profile: {
    get: authService.getProfile,
    update: authService.updateProfile,
    getAddresses: authService.getAddresses,
    addAddress: authService.addAddress,
  },
  orders: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<Order[], Order[]>("/orders", { params }),
    get: (id: string) => apiClient.get<Order, Order>(`/orders/${id}`),
    cancel: (id: string) => apiClient.post(`/orders/${id}/cancel`),
  },
  checkout: {
    preview: (data: Record<string, unknown>) =>
      apiClient.post("/checkout/preview", data),
    confirm: (data: Record<string, unknown>, idempotencyKey: string) =>
      apiClient.post("/checkout/confirm", data, {
        headers: { "Idempotency-Key": idempotencyKey },
      }),
  },
};
