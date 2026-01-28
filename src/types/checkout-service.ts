// Types for checkout-service
export type CheckoutPreviewPayload = {
  cart_id: number | string;
  fulfillment_type: "DELIVERY" | "PICKUP";
  branch_id?: number;
  delivery_slot_id?: number;
  address?: string;
};

export type CheckoutConfirmPayload = CheckoutPreviewPayload & {
  payment_token_id: number;
  save_as_default?: boolean;
};
