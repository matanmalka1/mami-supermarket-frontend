import * as z from "zod";

export const checkoutPreviewPayloadSchema = z.object({
  cart_id: z.coerce.number().int(),
  fulfillment_type: z.enum(["DELIVERY", "PICKUP"]),
  branch_id: z.coerce.number().int().optional(),
  delivery_slot_id: z.coerce.number().int().optional(),
  address: z.string().optional(),
});

export const checkoutConfirmPayloadSchema = checkoutPreviewPayloadSchema.extend(
  {
    payment_token_id: z.coerce.number().int(),
    save_as_default: z.boolean().optional(),
  },
);

export type CheckoutPreviewPayload = z.infer<
  typeof checkoutPreviewPayloadSchema
>;
export type CheckoutConfirmPayload = z.infer<
  typeof checkoutConfirmPayloadSchema
>;
