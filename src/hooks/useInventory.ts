import { useCallback } from "react";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";
import { useAsyncResource } from "./useAsyncResource";

export const useInventory = () => {
  const fetchInventory = useCallback(async () => {
    const data: any = await apiService.admin.getInventory();
    const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    return rows;
  }, []);

  const { data: inventory, setData: setInventory, loading, refresh } =
    useAsyncResource<any[]>(fetchInventory, {
      initialData: [],
      errorMessage: "Failed to load global inventory",
    });

  const updateStock = async (id: string, newQty: number) => {
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
