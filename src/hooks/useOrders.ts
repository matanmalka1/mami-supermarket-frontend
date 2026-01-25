import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Order } from "../types/domain";
import { toast } from "react-hot-toast";

type RawOrder = Order & { orderId?: string };

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const normalizeOrders = (orders: RawOrder[]) =>
    orders
      .map((order) => {
        const resolvedId = order.id || order.orderId;
        return resolvedId ? { ...order, id: resolvedId } : null;
      })
      .filter((order): order is Order => Boolean(order));

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.ops.getOrders();
      const incoming = Array.isArray(data) ? data : [];
      setOrders(normalizeOrders(incoming));
    } catch {
      toast.error("Orders sync failed. Reconnecting...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  return { orders, loading, selectedIds, toggleSelect, refresh: fetchOrders };
};
