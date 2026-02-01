import { apiClient } from "@/services/api-client";
import type { Order } from "./types";

const ORDERS_ENDPOINT = "/orders";

const toOrder = (payload: any): Order => ({
  id: payload.id,
  orderNumber: payload.orderNumber || payload.order_number,
  customerName: payload.customerName || payload.customer_name,
  customerPhone: payload.customerPhone || payload.customer_phone,
  status: payload.status,
  urgency: payload.urgency,
  total: payload.totalAmount || payload.total_amount || payload.total || 0,
  itemsCount:
    payload.itemsCount ||
    payload.items_count ||
    (Array.isArray(payload.items)
      ? payload.items.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0,
        )
      : 0),
  items: Array.isArray(payload.items)
    ? payload.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.unitPrice || item.unit_price || item.price,
        quantity: item.quantity,
        pickedStatus: item.pickedStatus || item.picked_status,
        imageUrl: item.imageUrl || item.image_url,
        unit: item.unit,
        replacementName: item.replacementName || item.replacement_name,
      }))
    : [],
  deliverySlot:
    payload.deliverySlot || payload.delivery_slot
      ? {
          id: (payload.deliverySlot || payload.delivery_slot).id,
          startTime: (payload.deliverySlot || payload.delivery_slot).start_time,
          endTime: (payload.deliverySlot || payload.delivery_slot).end_time,
          date: (payload.deliverySlot || payload.delivery_slot).date,
        }
      : undefined,
  createdAt: payload.createdAt || payload.created_at,
});

export const ordersService = {
  list: async (params?: Record<string, unknown>): Promise<Order[]> => {
    const data = await apiClient.get<any[], any[]>(ORDERS_ENDPOINT, { params });
    return Array.isArray(data) ? data.map(toOrder) : [];
  },
  get: async (id: number | string): Promise<Order> => {
    const data = await apiClient.get<any, any>(`${ORDERS_ENDPOINT}/${id}`);
    return toOrder(data);
  },
  cancel: async (id: number | string): Promise<void> => {
    await apiClient.post(`${ORDERS_ENDPOINT}/${id}/cancel`);
  },
};
