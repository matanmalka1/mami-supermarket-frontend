import { useState, useCallback } from "react";
import { opsService } from "@/domains/ops/service";
import type { Order } from "@/domains/orders/types";
import { useAsyncResource } from "@/hooks/useAsyncResource";

type RawOrder = Order & { orderId?: number };

export const useOrders = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const normalizeOrders = useCallback(
    (orders: RawOrder[]) =>
      orders
        .map((order) => {
          const resolvedId = order.id || order.orderId;
          return resolvedId ? { ...order, id: resolvedId } : null;
        })
        .filter((order): order is Order => Boolean(order)),
    [],
  );

  const fetchOrders = useCallback(async () => {
    const data = await opsService.getOrders();
    const incoming = Array.isArray(data) ? data : [];
    return normalizeOrders(incoming);
  }, [normalizeOrders]);

  const { data: orders, loading, refresh } = useAsyncResource<Order[]>(fetchOrders, {
    initialData: [],
    errorMessage: "Orders sync failed. Reconnecting...",
  });

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  return { orders, loading, selectedIds, toggleSelect, refresh };
};
