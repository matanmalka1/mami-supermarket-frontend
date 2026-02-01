// Orders domain types (frontend only, type aliases, no imports, no backend/DTO naming)

export const OrderStatus = {
  CREATED: "CREATED",
  IN_PROGRESS: "IN_PROGRESS",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
  DELAYED: "DELAYED",
  MISSING: "MISSING",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// Shared status labels
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "Created",
  [OrderStatus.IN_PROGRESS]: "In Progress",
  [OrderStatus.READY]: "Ready",
  [OrderStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELED]: "Canceled",
  [OrderStatus.DELAYED]: "Delayed",
  [OrderStatus.MISSING]: "Missing",
};

export type OrderUrgency = "critical" | "dueSoon" | "onTrack" | "scheduled";

export type OrderProductInfo = {
  id?: number | string;
  name: string;
  category?: string;
  image?: string;
};

export type PickedStatus =
  | "pending"
  | "picked"
  | "missing"
  | "replaced"
  | "PENDING"
  | "PICKED"
  | "MISSING"
  | "REPLACED";

export type OrderItem = {
  id: number | string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  pickedStatus?: PickedStatus;
  imageUrl?: string;
  product?: OrderProductInfo;
  unit?: string;
  replacementName?: string;
};

export type OrderDeliverySlot = {
  id: number | string;
  startTime: string;
  endTime: string;
  date?: string;
};

export type OrderCustomer = {
  id?: number | string;
  fullName: string;
  phone?: string;
};

export type Order = {
  id: number | string;
  orderNumber: string;
  customerName: string;
  customer?: OrderCustomer;
  customerPhone?: string;
  status: OrderStatus;
  urgency: OrderUrgency;
  total: number;
  itemsCount: number;
  itemsSummary?: string;
  items: OrderItem[];
  deliverySlot?: OrderDeliverySlot;
  createdAt: string;
};

export type OrderSuccessFulfillment = "delivery" | "pickup";

export type OrderSuccessItem = {
  id: number | string;
  name: string;
  imageUrl?: string;
  image?: string;
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
