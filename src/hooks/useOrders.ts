import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Order } from "../types/domain";
import { toast } from "react-hot-toast";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.ops.getOrders();
      setOrders(Array.isArray(data) ? data : []);
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
