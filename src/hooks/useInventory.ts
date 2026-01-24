import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { Product } from "../types/domain";
import { toast } from "react-hot-toast";

export const useInventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const data: any = await apiService.admin.getInventory();
      const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setInventory(rows);
    } catch (err) {
      toast.error("Failed to load global inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

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
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  return { inventory, loading, updateStock, refresh: fetchInventory };
};
