import * as z from "zod";

export const checkoutPreviewPayloadSchema = z.object({
  cart_id: z.string(),
  fulfillment_type: z.enum(["DELIVERY", "PICKUP"]),
  branch_id: z.string().optional(),
  delivery_slot_id: z.string().optional(),
  address: z.string().optional(),
});

export const checkoutConfirmPayloadSchema = checkoutPreviewPayloadSchema.extend(
  {
    payment_token_id: z.string(),
    save_as_default: z.boolean().optional(),
  },
);

export type CheckoutPreviewPayload = z.infer<
  typeof checkoutPreviewPayloadSchema
>;
export type CheckoutConfirmPayload = z.infer<
  typeof checkoutConfirmPayloadSchema
>;
