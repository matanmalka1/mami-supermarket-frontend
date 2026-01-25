import * as z from "zod";

export const opsAlertSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.string().optional(),
  severity: z.string().optional(),
  time: z.string().optional(),
  createdAt: z.string().optional(),
});

export const updateItemStatusRequestSchema = z.object({
  picked_status: z.string(),
  reason: z.string().optional(),
  replacement_product_id: z.string().optional(),
});

export const updateOrderStatusRequestSchema = z.object({
  status: z.string(),
});

export const createStockRequestSchema = z.object({
  branch_id: z.string(),
  product_id: z.string(),
  quantity: z.number().int(),
  request_type: z.string(),
});

export type OpsAlert = z.infer<typeof opsAlertSchema>;
export type UpdateItemStatusRequest = z.infer<
  typeof updateItemStatusRequestSchema
>;
export type UpdateOrderStatusRequest = z.infer<
  typeof updateOrderStatusRequestSchema
>;
export type CreateStockRequest = z.infer<typeof createStockRequestSchema>;
