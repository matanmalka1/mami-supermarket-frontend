export type OrderSuccessFulfillment = "DELIVERY" | "PICKUP";

export interface OrderSuccessItem {
  id: number | string;
  name: string;
  image?: string;
  unit?: string;
  price: number;
  quantity: number;
}

export interface OrderSuccessSnapshot {
  orderId: string;
  orderNumber?: string;
  fulfillmentType: OrderSuccessFulfillment;
  items: OrderSuccessItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery?: string;
  deliverySlot?: string;
  pickupBranch?: string;
  deliveryAddress?: string;
}
