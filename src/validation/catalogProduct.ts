import * as z from 'zod';

export const catalogProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than zero'),
  categoryId: z.string().min(1, 'Category selection is required'),
  description: z.string().optional(),
});

export type CatalogProductInput = z.infer<typeof catalogProductSchema>;
