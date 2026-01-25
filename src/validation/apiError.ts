import * as z from "zod";

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

export const errorCodeSchema = z.enum([
  "INSUFFICIENT_STOCK",
  "PAYMENT_FAILED",
  "INVALID_SLOT",
  "INVALID_STATUS_TRANSITION",
  "UNAUTHORIZED",
  "NOT_FOUND",
  "VALIDATION_ERROR",
  "INTERNAL_ERROR",
]);

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ErrorCode = z.infer<typeof errorCodeSchema>;
