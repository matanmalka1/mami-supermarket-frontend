// Types for checkout-service
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
