import { apiClient } from "./api-client";

export type CheckoutPreviewPayload = {
  cart_id: string;
  fulfillment_type: "DELIVERY" | "PICKUP";
  branch_id?: string;
  delivery_slot_id?: string;
  address?: string;
};

export type CheckoutConfirmPayload = CheckoutPreviewPayload & {
  payment_token_id: string;
  save_as_default?: boolean;
};

export const checkoutService = {
  preview: (data: CheckoutPreviewPayload) =>
    apiClient.post<CheckoutPreviewPayload, any>("/checkout/preview", data),
  confirm: (data: CheckoutConfirmPayload, idempotencyKey: string) =>
    apiClient.post<CheckoutConfirmPayload, any>("/checkout/confirm", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    }),
};
