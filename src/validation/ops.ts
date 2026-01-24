import * as z from 'zod';

export const stockRequestSchema = z.object({
  product: z.string().min(2, 'Product identifier is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  priority: z.enum(['Normal', 'Urgent', 'Critical']).default('Normal'),
});

export type StockRequestInput = z.infer<typeof stockRequestSchema>;

export const inventoryUpdateSchema = z.object({
  availableQuantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
});
