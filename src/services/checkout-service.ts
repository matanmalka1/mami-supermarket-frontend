import { apiClient } from "./api-client";
import {
  CheckoutPreviewPayload,
  CheckoutConfirmPayload,
} from "../types/checkout-service";

export const checkoutService = {
  preview: (data: CheckoutPreviewPayload) =>
    apiClient.post<CheckoutPreviewPayload, any>("/checkout/preview", data),

  confirm: (data: CheckoutConfirmPayload, idempotencyKey: string) =>
    apiClient.post<CheckoutConfirmPayload, any>("/checkout/confirm", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    }),

  createPaymentToken: async (
    cardDetails?: any,
  ): Promise<{ payment_token_id: number }> => {
    return { payment_token_id: 1 };
  },
};
