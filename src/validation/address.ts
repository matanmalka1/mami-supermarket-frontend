import * as z from 'zod';

export const addressSchema = z.object({
  street: z.string().min(2, 'Street & House # is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal Code is required'),
  country: z.string().min(2, 'Country is required'),
});

export type AddressInput = z.infer<typeof addressSchema>;
