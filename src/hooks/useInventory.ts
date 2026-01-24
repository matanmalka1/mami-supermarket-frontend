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
      const data = await apiService.admin.getInventory();
      setInventory(data);
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
    try {
      await apiService.admin.updateStock(id, { availableQuantity: newQty });
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
