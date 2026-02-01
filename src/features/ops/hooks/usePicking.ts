import { useState, useEffect, useCallback } from "react";
import { opsService } from "@/domains/ops/service";
import { Order, OrderItem, OrderStatus } from "@/domains/orders/types";
import { toast } from "react-hot-toast";

const FINALIZED_STATUSES = new Set<OrderStatus>([
  OrderStatus.CANCELED,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.MISSING,
]);

export const usePicking = (orderId?: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isBatchMode = Boolean(orderId?.startsWith("batch-"));
  const fetchPickList = useCallback(async () => {
    if (!orderId || isBatchMode) return;
    setLoading(true);
    setError(null);
    const parsedOrderId = Number(orderId);
    if (Number.isNaN(parsedOrderId)) {
      setError("Invalid order identifier");
      setLoading(false);
      return;
    }
    try {
      const data = await opsService.getOrder(parsedOrderId);
      setOrder(data);
      setItems(data.items || []);
    } catch (err: any) {
      const message = err?.message || "Failed to load pick list";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [orderId, isBatchMode]);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (isBatchMode) {
      const message = "Batch picking is not supported yet";
      setError(message);
      setOrder(null);
      setItems([]);
      setLoading(false);
      return;
    }
    fetchPickList();
  }, [fetchPickList, orderId, isBatchMode]);

  const updateItemStatus = async (
    itemId: string | number,
    status: string,
    reason?: string,
    replacementId?: number,
  ) => {
    if (!orderId) return;
    try {
      const parsedOrderId = Number(orderId);
      if (Number.isNaN(parsedOrderId)) {
        throw new Error("Invalid order identifier");
      }
      const parsedItemId = Number(itemId);
      if (Number.isNaN(parsedItemId)) {
        throw new Error("Invalid item identifier");
      }
      const updated = await opsService.updateItemStatus(
        parsedOrderId,
        parsedItemId,
        {
          picked_status: status,
        },
      );
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

  const isFinalized = Boolean(order && FINALIZED_STATUSES.has(order.status));

  return {
    order,
    items,
    loading,
    error,
    progress,
    updateItemStatus,
    refresh: fetchPickList,
    isFinalized,
  };
};
