import * as z from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  category: z.string(),
  price: z.number(),
  oldPrice: z.number().optional(),
  availableQuantity: z.number(),
  reservedQuantity: z.number(),
  status: z.string(),
  imageUrl: z.string(),
  binLocation: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
