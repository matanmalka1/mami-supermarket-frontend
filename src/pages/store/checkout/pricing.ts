/**
 * Checkout configuration constants (defaults, overridden by global settings)
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
  deliveryMin?: number,
  deliveryFee?: number,
): number => {
  if (previewFee !== undefined && previewFee !== null) {
    return Number(previewFee);
  }

  const threshold = deliveryMin ?? CHECKOUT_CONFIG.DELIVERY_THRESHOLD;
  const fee = deliveryFee ?? CHECKOUT_CONFIG.DELIVERY_FEE_UNDER_THRESHOLD;

  if (method === "DELIVERY" && subtotal < threshold) {
    return fee;
  }

  return 0;
};
