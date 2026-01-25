import * as z from "zod";

export const inventoryProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  imageUrl: z.string().optional(),
  image_url: z.string().optional(),
});

export const inventoryBranchSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
});

export const inventoryRowSchema = z.object({
  id: z.string(),
  availableQuantity: z.number().optional(),
  reservedQuantity: z.number().optional(),
  available_quantity: z.number().optional(),
  reserved_quantity: z.number().optional(),
  product: inventoryProductSchema.optional(),
  branch: inventoryBranchSchema.optional(),
});

export type InventoryProduct = z.infer<typeof inventoryProductSchema>;
export type InventoryBranch = z.infer<typeof inventoryBranchSchema>;
export type InventoryRow = z.infer<typeof inventoryRowSchema>;
