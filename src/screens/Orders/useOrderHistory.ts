import { useCallback, useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { OrderHistoryEntry } from "@/types/order-history";

export const useOrderHistory = () => {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.orders.list();
      setOrders(Array.isArray(data) ? (data as OrderHistoryEntry[]) : []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  return { orders, loading, refreshOrders };
};
