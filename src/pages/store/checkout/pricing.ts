/**
 * Checkout configuration constants
 */
export const CHECKOUT_CONFIG = {
  DELIVERY_THRESHOLD: 150,
  DELIVERY_FEE_UNDER_THRESHOLD: 30,
} as const;

/**
 * Calculate delivery fee based on subtotal and method
 */
export const calculateDeliveryFee = (
  method: "DELIVERY" | "PICKUP",
  subtotal: number,
  previewFee?: number | null,
): number => {
  if (previewFee !== undefined && previewFee !== null) {
    return Number(previewFee);
  }

  if (method === "DELIVERY" && subtotal < CHECKOUT_CONFIG.DELIVERY_THRESHOLD) {
    return CHECKOUT_CONFIG.DELIVERY_FEE_UNDER_THRESHOLD;
  }

  return 0;
};
