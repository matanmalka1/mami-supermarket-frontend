import { apiClient } from "@/services/api-client";
import type { CartResponse } from "@/domains/cart/types";

export const cartService = {
  get: () => apiClient.get<CartResponse, CartResponse>("/cart"),
  
  addItem: (productId: number, quantity: number = 1) =>
    apiClient.post<{ productId: number; quantity: number }, CartResponse>(
      "/cart/items",
      { productId, quantity }
    ),
  
  updateItem: (itemId: number, productId: number, quantity: number) =>
    apiClient.put<{ productId: number; quantity: number }, CartResponse>(
      `/cart/items/${itemId}`,
      { productId, quantity }
    ),
  
  removeItem: (itemId: number) =>
    apiClient.delete<void, CartResponse>(`/cart/items/${itemId}`),
  
  clear: () => apiClient.delete<void, CartResponse>("/cart"),
};
