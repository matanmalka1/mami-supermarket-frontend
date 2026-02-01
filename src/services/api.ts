import { authService } from "@/domains/auth/service";
import { opsService } from "@/domains/ops/service";
import { adminService } from "@/domains/admin/service";
import { catalogService } from "@/domains/catalog/service";
import { checkoutService } from "@/domains/checkout/service";
import { cartService } from "@/domains/cart/service";
import { branchService } from "@/domains/branch/service";
import { ordersService } from "@/domains/orders/service";

export const apiService = {
  auth: authService,
  ops: opsService,
  admin: adminService,
  catalog: catalogService,
  checkout: checkoutService,
  cart: cartService,
  branches: branchService,
  orders: ordersService,
  profile: {
    get: authService.getProfile,
    update: authService.updateProfile,
    getAddresses: authService.getAddresses,
    addAddress: authService.addAddress,
    deleteAddress: authService.deleteAddress,
    setDefaultAddress: authService.setDefaultAddress,
  },
};
