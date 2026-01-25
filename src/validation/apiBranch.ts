import * as z from "zod";

export const branchResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  isActive: z.boolean(),
});

export const deliverySlotResponseSchema = z.object({
  id: z.string(),
  branchId: z.string(),
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
});

export const deliverySlotOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export type BranchResponse = z.infer<typeof branchResponseSchema>;
export type DeliverySlotResponse = z.infer<typeof deliverySlotResponseSchema>;
export type DeliverySlotOption = z.infer<typeof deliverySlotOptionSchema>;
