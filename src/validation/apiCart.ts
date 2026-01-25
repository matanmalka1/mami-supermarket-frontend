import * as z from "zod";

export const cartItemResponseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().int(),
  unitPrice: z.number(),
});

export const cartResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalAmount: z.number(),
  items: z.array(cartItemResponseSchema),
});

export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
