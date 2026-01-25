import * as z from 'zod';

export const newSkuSchema = z.object({
  productName: z.string().min(2, 'Product name is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than zero'),
  initialStock: z.coerce.number().int().min(0, 'Initial stock cannot be negative'),
  description: z.string().optional(),
  selectedCategory: z.string().min(1, 'Category selection is required'),
  selectedBranch: z.string().min(1, 'Branch selection is required'),
});

export type NewSkuInput = z.infer<typeof newSkuSchema>;
