export interface CartItemResponse {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  totalAmount: number;
  items: CartItemResponse[];
}
