import * as z from "zod";

export const stockRequestSchema = z.object({
  branchId: z.string().uuid("Branch ID must be a valid UUID"),
  productId: z.string().uuid("Product ID must be a valid UUID"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  requestType: z.enum(["ADD_QUANTITY", "SET_QUANTITY"]),
  note: z.string().max(200, "Note too long").optional(),
});

export type StockRequestInput = z.infer<typeof stockRequestSchema>;

export const inventoryUpdateSchema = z.object({
  availableQuantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});
