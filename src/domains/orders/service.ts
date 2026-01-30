import { apiClient } from "@/services/api-client";
import type { Order } from "./types";

const ORDERS_ENDPOINT = "/orders";

const toOrder = (payload: any): Order => ({
  id: payload.id,
  orderNumber: payload.order_number || payload.orderNumber,
  customerName: payload.customer_name || payload.customerName,
  customerPhone: payload.customer_phone || payload.customerPhone,
  status: payload.status,
  urgency: payload.urgency,
  total: payload.total,
  itemsCount: payload.items_count || payload.itemsCount,
  items: Array.isArray(payload.items)
    ? payload.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        pickedStatus: item.picked_status || item.pickedStatus,
        imageUrl: item.image_url || item.imageUrl,
        unit: item.unit,
        replacementName: item.replacement_name || item.replacementName,
      }))
    : [],
  deliverySlot: payload.delivery_slot
    ? {
        id: payload.delivery_slot.id,
        startTime:
          payload.delivery_slot.start_time || payload.delivery_slot.startTime,
        endTime:
          payload.delivery_slot.end_time || payload.delivery_slot.endTime,
        date: payload.delivery_slot.date,
      }
    : undefined,
  createdAt: payload.created_at || payload.createdAt,
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
