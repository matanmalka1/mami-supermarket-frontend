import { apiClient } from "@/services/api-client";
import type { InventoryRow } from "./types";

const INVENTORY_ENDPOINT = "/admin/inventory";

const toInventoryRow = (payload: any): InventoryRow => ({
  id: payload.id,
  availableQuantity: payload.available_quantity,
  reservedQuantity: payload.reserved_quantity,
  product: payload.product
    ? {
        id: payload.product.id,
        name: payload.product.name,
        sku: payload.product.sku,
        imageUrl: payload.product.image_url || payload.product.imageUrl,
      }
    : undefined,
  branch: payload.branch
    ? {
        id: payload.branch.id,
        name: payload.branch.name,
      }
    : undefined,
});

export const inventoryService = {
  getInventory: async (): Promise<InventoryRow[]> => {
    const data = await apiClient.get<any[], any[]>(INVENTORY_ENDPOINT);
    return Array.isArray(data) ? data.map(toInventoryRow) : [];
  },
  updateStock: async (
    id: number,
    availableQuantity: number,
    reservedQuantity: number = 0,
  ): Promise<void> => {
    await apiClient.patch(`${INVENTORY_ENDPOINT}/${id}`, {
      available_quantity: availableQuantity,
      reserved_quantity: reservedQuantity,
    });
  },
};
