import { authService } from "@/domains/auth/service";
import { opsService } from "@/domains/ops/service";
import { adminService } from "@/domains/admin/service";
import { catalogService } from "@/domains/catalog/service";
import { checkoutService } from "@/domains/checkout/service";
import { cartService } from "@/domains/cart/service";
import { branchService } from "@/domains/branch/service";
import { apiClient } from "./api-client";
import { Order } from "@/domains/orders/types";

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
    get: (id: number) => apiClient.get<Order, Order>(`/orders/${id}`),
    cancel: (id: number) => apiClient.post(`/orders/${id}/cancel`),
  },
};
