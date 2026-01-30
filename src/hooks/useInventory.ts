import { useCallback } from "react";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";
import { useAsyncResource } from "./useAsyncResource";
import { InventoryRow } from "@/domains/inventory/types";
import type { InventoryResponse } from "@/types/admin-service";
import { extractArrayPayload } from "@/utils/api-response";

export const useInventory = () => {
  const toInventoryRow = (payload: InventoryResponse): InventoryRow => ({
    id: payload.id,
    availableQuantity: payload.available_quantity,
    reservedQuantity: payload.reserved_quantity,
    branch: {
      id: payload.branch_id,
      name: payload.branch_name,
    },
    product: {
      id: payload.product_id,
      name: payload.product_name,
      sku: payload.productSku,
    },
  });

  const fetchInventory = useCallback(async () => {
    const data = await apiService.admin.getInventory();
    const rows = extractArrayPayload<InventoryResponse>(data);
    return rows.map(toInventoryRow);
  }, []);

  const {
    data: inventory,
    setData: setInventory,
    loading,
    refresh,
  } = useAsyncResource<InventoryRow[]>(fetchInventory, {
    initialData: [],
    errorMessage: "Failed to load global inventory",
  });

  const updateStock = async (id: number, newQty: number) => {
    if (Number.isNaN(newQty) || newQty < 0) {
      toast.error("Quantity must be a non-negative number");
      return;
    }
    const current = inventory.find((item) => item.id === id);
    const reserved =
      current?.reservedQuantity ?? current?.reserved_quantity ?? 0;
    try {
      await apiService.admin.updateStock(id, {
        availableQuantity: newQty,
        reservedQuantity: reserved,
      });
      setInventory((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, availableQuantity: newQty } : inv,
        ),
      );
      toast.success("Stock level synchronized");
    } catch {
      toast.error("Sync failed");
    }
  };

  return { inventory, loading, updateStock, refresh };
};
