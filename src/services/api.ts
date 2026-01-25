import { authService } from "./auth-service";
import { opsService } from "./ops-service";
import { adminService } from "./admin-service";
import { catalogService } from "./catalog-service";
import { checkoutService } from "./checkout-service";
import { cartService } from "./cart-service";
import { branchService } from "./branch-service";
import { apiClient } from "./api-client";
import { Order } from "../types/domain";

export const apiService = {
  auth: authService,
  ops: opsService,
  admin: adminService,
  catalog: catalogService,
  checkout: checkoutService,
  cart: cartService,
  branches: branchService,
  profile: {
    get: authService.getProfile,
    update: authService.updateProfile,
    getAddresses: authService.getAddresses,
    addAddress: authService.addAddress,
    deleteAddress: authService.deleteAddress,
    setDefaultAddress: authService.setDefaultAddress,
  },
  orders: {
    list: (params?: Record<string, unknown>) =>
      apiClient.get<Order[], Order[]>("/orders", { params }),
    get: (id: string) => apiClient.get<Order, Order>(`/orders/${id}`),
    cancel: (id: string) => apiClient.post(`/orders/${id}/cancel`),
  },
};
