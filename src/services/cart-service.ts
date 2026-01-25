import { apiClient } from "./api-client";
import { CartResponse } from "@/types/cart";

export const cartService = {
  get: () => apiClient.get<CartResponse, CartResponse>("/cart"),
};
