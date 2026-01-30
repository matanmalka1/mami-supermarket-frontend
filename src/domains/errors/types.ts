/**
 * @deprecated [2026-01-29] This domain types file has no active consumers and is considered dead code.
 * If you need to revive it, please update documentation and add a consumer.
 */
// Error & API envelope domain types

export type ErrorCode =
  | "INSUFFICIENT_STOCK"
  | "PAYMENT_FAILED"
  | "INVALID_SLOT"
  | "INVALID_STATUS_TRANSITION"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiEnvelope<T> {
  data: T;
  error?: ApiError;
}
