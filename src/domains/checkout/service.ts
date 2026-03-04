import { apiClient } from "@/services/api-client";
import type { CardDetails } from "@/features/checkout/components/PaymentStep";
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

  createPaymentToken: async (
    cardDetails: CardDetails,
  ): Promise<{ paymentTokenId: number }> => {
    const response = await apiClient.post<
      { cardNumber: string; cardHolderName: string; expiry: string },
      { paymentTokenId: number }
    >("/me/payment-tokens", {
      cardNumber: cardDetails.cardNumber,
      cardHolderName: cardDetails.cardHolderName,
      expiry: cardDetails.expiry,
    });
    return response;
  },
};
