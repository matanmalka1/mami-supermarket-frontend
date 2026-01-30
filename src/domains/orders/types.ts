// Orders domain types (frontend only, type aliases, no imports, no backend/DTO naming)

export type OrderStatus =
  | "pending"
  | "inProgress"
  | "picking"
  | "received"
  | "delayed"
  | "completed"
  | "cancelled";

export type OrderUrgency = "critical" | "dueSoon" | "onTrack" | "scheduled";

export type OrderItem = {
  id: number | string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  pickedStatus?: "pending" | "picked" | "missing" | "replaced";
  imageUrl?: string;
  unit?: string;
  replacementName?: string;
};

export type OrderDeliverySlot = {
  id: number | string;
  startTime: string;
  endTime: string;
  date?: string;
};

export type Order = {
  id: number | string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  status: OrderStatus;
  urgency: OrderUrgency;
  total: number;
  itemsCount: number;
  items: OrderItem[];
  deliverySlot?: OrderDeliverySlot;
  createdAt: string;
};

export type OrderSuccessFulfillment = "delivery" | "pickup";

export type OrderSuccessItem = {
  id: number | string;
  name: string;
  imageUrl?: string;
  unit?: string;
  price: number;
  quantity: number;
};

export type OrderSuccessSnapshot = {
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
};
