import { toast } from "react-hot-toast";
import { CartItem } from "../cart-context";
import { cartService } from "@/domains/cart/service";
import {
  findBackendItemByProductId,
  normalizeProductId,
  validateQuantityAvailability,
} from "./helpers";

/**
 * Map backend cart items to frontend format
 */
export const mapBackendItems = (
  backendItems: any[],
  productCache: Map<number, any>,
): CartItem[] => {
  return backendItems.map((item) => {
    const productId = normalizeProductId(item.productId);
    const cachedProduct = productCache.get(productId);

    return {
      id: productId,
      name:
        item.productName || cachedProduct?.name || `Product ${item.productId}`,
      price: item.unitPrice,
      image:
        item.productImage ||
        cachedProduct?.imageUrl ||
        cachedProduct?.image ||
        "",
      quantity: item.quantity,
      unit: cachedProduct?.unit,
      availableQuantity: cachedProduct?.availableQuantity,
    };
  });
};

/**
 * Add item to cart with validation
 */
export const addItemToCart = async (
  product: any,
  currentItems: CartItem[],
  productCache: Map<number, any>,
): Promise<boolean> => {
  const availableQty =
    typeof product.availableQuantity === "number"
      ? Math.max(0, product.availableQuantity)
      : undefined;

  const existing = currentItems.find((i) => i.id === product.id);
  const currentQty = existing ? existing.quantity : 0;

  const validation = validateQuantityAvailability(currentQty, availableQty);

  if (!validation.valid) {
    toast.error(validation.error!);
    return false;
  }

  try {
    const productId = normalizeProductId(product.id);
    productCache.set(productId, product);

    await cartService.addItem(productId, 1);
    toast.success(`${product.name} added to cart`, { duration: 2000 });
    return true;
  } catch (error: any) {
    console.error("[CartContext] Failed to add item:", error);

    if (error?.code === "OUT_OF_STOCK_DELIVERY_BRANCH") {
      toast.error(`${product.name} is currently out of stock for delivery`);
    } else if (error?.message?.toLowerCase().includes("out of stock")) {
      toast.error(`${product.name} is currently out of stock`);
    } else {
      toast.error(error?.message || "Failed to add item to cart");
    }
    return false;
  }
};

/**
 * Remove item from cart
 */
export const removeItemFromCart = async (
  id: number | string,
): Promise<boolean> => {
  const numericId = normalizeProductId(id);

  const backendItem = await findBackendItemByProductId(numericId);
  if (!backendItem) {
    toast.error("Failed to find item in cart");
    return false;
  }

  try {
    await cartService.removeItem(backendItem.itemId);
    return true;
  } catch (error: any) {
    console.error("[CartContext] Failed to remove item:", error);
    toast.error("Failed to remove item from cart");
    return false;
  }
};

/**
 * Update item quantity in cart
 */
export const updateItemQuantity = async (
  id: number | string,
  qty: number,
): Promise<boolean> => {
  if (qty < 1) return false;

  const numericId = normalizeProductId(id);
  const backendItem = await findBackendItemByProductId(numericId);

  if (!backendItem) {
    toast.error("Failed to find item in cart");
    return false;
  }

  try {
    await cartService.updateItem(
      backendItem.itemId,
      backendItem.productId,
      qty,
    );
    return true;
  } catch (error: any) {
    console.error("[CartContext] Failed to update quantity:", error);
    toast.error("Failed to update quantity");
    return false;
  }
};
