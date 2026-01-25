import * as z from 'zod';

export const deliveryBlackoutSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  reason: z.string().min(2, 'Reason is required'),
});

export type DeliveryBlackoutInput = z.infer<typeof deliveryBlackoutSchema>;
