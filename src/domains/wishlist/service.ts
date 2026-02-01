import { apiClient } from "@/services/api-client";

export interface WishlistItemResponse {
  productId: number;
  createdAt: string;
}

export interface WishlistListResponse {
  items: WishlistItemResponse[];
}

export interface AddWishlistRequest {
  productId: number;
}

export const wishlistService = {
  list: () =>
    apiClient.get<WishlistListResponse, WishlistListResponse>(
      "/store/wishlist",
    ),
  add: (productId: number) =>
    apiClient.post<AddWishlistRequest, WishlistItemResponse>(
      "/store/wishlist",
      { productId },
    ),
  remove: (productId: number) =>
    apiClient.delete<void, { removed: boolean }>(
      `/store/wishlist/${productId}`,
    ),
};
