import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Order, OrderItem } from "../types/domain";
import { toast } from "react-hot-toast";

export const usePicking = (orderId?: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPickList = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await apiService.ops.getOrder(orderId);
      setOrder(data);
      setItems(data.items || []);
    } catch {
      toast.error("Failed to load pick list");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchPickList();
  }, [fetchPickList]);

  const updateItemStatus = async (
    itemId: string,
    status: string,
    reason?: string,
    replacementId?: string,
  ) => {
    if (!orderId) return;
    try {
      const updated = await apiService.ops.updateItemStatus(orderId, itemId, {
        picked_status: status,
        reason,
        replacement_product_id: replacementId,
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                pickedStatus: status as any,
                replacementProductId: replacementId,
              }
            : i,
        ),
      );
      return updated;
    } catch {
      toast.error("Sync failed");
      throw new Error("Sync failed");
    }
  };

  const progress =
    items.length > 0
      ? Math.round(
          (items.filter((i) => i.pickedStatus === "PICKED").length /
            items.length) *
            100,
        )
      : 0;

  return {
    order,
    items,
    loading,
    progress,
    updateItemStatus,
    refresh: fetchPickList,
  };
};
