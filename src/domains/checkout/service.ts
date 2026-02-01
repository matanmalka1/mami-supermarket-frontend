import { apiClient } from "@/services/api-client";
import type { CheckoutCartItem, CheckoutOrderSummary } from "./types";

type CheckoutPreviewPayload = {
  cartId: number | string;
  fulfillmentType: "DELIVERY" | "PICKUP";
  branchId?: number;
  deliverySlotId?: number;
  address?: string;
};

type CheckoutConfirmPayload = CheckoutPreviewPayload & {
  paymentTokenId: number;
  saveAsDefault?: boolean;
};

export const checkoutService = {
  preview: (data: CheckoutPreviewPayload) =>
    apiClient.post<CheckoutPreviewPayload, CheckoutOrderSummary>(
      "/checkout/preview",
      data,
    ),

  confirm: (data: CheckoutConfirmPayload, idempotencyKey: string) =>
    apiClient.post<CheckoutConfirmPayload, { orderId: number }>(
      "/checkout/confirm",
      data,
      {
        headers: { "Idempotency-Key": idempotencyKey },
      },
    ),

  createPaymentToken: async (): Promise<{ paymentTokenId: number }> => {
    return { paymentTokenId: 1 };
  },
};
