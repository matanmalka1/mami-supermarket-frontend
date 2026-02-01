import { cartService } from "@/domains/cart/service";

/**
 * Helper to find backend cart item by product ID
 */
export const findBackendItemByProductId = async (
  productId: number,
): Promise<{ itemId: number; productId: number } | null> => {
  try {
    const response = await cartService.get();
    const backendItem = response.items.find((bi) => {
      const pid =
        typeof bi.productId === "string"
          ? parseInt(bi.productId, 10)
          : bi.productId;
      return pid === productId;
    });

    if (backendItem && backendItem.id) {
      return {
        itemId:
          typeof backendItem.id === "string"
            ? parseInt(backendItem.id, 10)
            : backendItem.id,
        productId:
          typeof backendItem.productId === "string"
            ? parseInt(backendItem.productId, 10)
            : backendItem.productId,
      };
    }
    return null;
  } catch (error) {
    console.error("[CartContext] Failed to find backend item:", error);
    return null;
  }
};

/**
 * Normalize product ID to number
 */
export const normalizeProductId = (id: number | string): number => {
  return typeof id === "string" ? parseInt(id, 10) : id;
};

/**
 * Check if quantity is within available stock
 */
export const validateQuantityAvailability = (
  currentQty: number,
  availableQty: number | undefined,
): { valid: boolean; error?: string } => {
  if (availableQty !== undefined) {
    if (availableQty <= 0) {
      return { valid: false, error: "This item is out of stock" };
    }
    if (currentQty >= availableQty) {
      return {
        valid: false,
        error: "You have reached the available stock for this item",
      };
    }
  }
  return { valid: true };
};
