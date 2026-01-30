// Cart domain types

export interface CartItemResponse {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  totalAmount: number;
  items: CartItemResponse[];
}
