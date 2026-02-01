import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { adminService } from "@/domains/admin/service";
import { InventoryRow } from "@/domains/inventory/types";
import { extractArrayPayload } from "@/utils/api-response";

type InventoryResponse = {
  id: number;
  branch_id: number;
  branch_name: string;
  product_id: number;
  product_name: string;
  available_quantity: number;
  reserved_quantity: number;
  productSku: string;
};

export const useInventory = () => {
  const toInventoryRow = (payload: any): InventoryRow => ({
    id: payload.id,
    availableQuantity: payload.availableQuantity ?? payload.available_quantity,
    reservedQuantity: payload.reservedQuantity ?? payload.reserved_quantity,
    branch: {
      id: payload.branchId ?? payload.branch_id,
      name: payload.branchName ?? payload.branch_name,
    },
    product: {
      id: payload.productId ?? payload.product_id,
      name: payload.productName ?? payload.product_name,
      sku: payload.productSku ?? payload.product_sku,
    },
  });

  const fetchInventory = useCallback(async () => {
    const data = await adminService.getInventory();
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
      await adminService.updateStock(id, {
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
