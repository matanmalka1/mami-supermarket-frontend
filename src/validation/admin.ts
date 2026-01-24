import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Category selection is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than zero'),
  sku: z.string().optional(),
  binLocation: z.string().optional(),
  description: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const globalSettingsSchema = z.object({
  vatRate: z.coerce.number().min(0).max(100),
  freeDeliveryThreshold: z.coerce.number().min(0),
});
