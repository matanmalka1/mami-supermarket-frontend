import type { Order } from "@/domains/orders/types";

export const formatOrderLabel = (order: Order) => {
  if (order.orderNumber) return `#${order.orderNumber}`;
  if (order.customer?.fullName) return order.customer.fullName;
  if (order.deliverySlot?.startTime)
    return `Slot • ${order.deliverySlot.startTime}`;
  return "Order";
};
