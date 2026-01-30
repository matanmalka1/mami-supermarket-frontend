import { apiClient } from "@/services/api-client";
import type { CartResponse } from "@/domains/cart/types";

export const cartService = {
  get: () => apiClient.get<CartResponse, CartResponse>("/cart"),
};
