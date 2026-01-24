import { ApiError } from './api';

export type ErrorCode = 
  | 'INSUFFICIENT_STOCK'
  | 'PAYMENT_FAILED'
  | 'INVALID_SLOT'
  | 'INVALID_STATUS_TRANSITION'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INSUFFICIENT_STOCK: 'One or more items are no longer in stock.',
  PAYMENT_FAILED: 'Your payment could not be processed. Please check your card.',
  INVALID_SLOT: 'The selected delivery slot is no longer available.',
  INVALID_STATUS_TRANSITION: 'This order status cannot be updated in its current state.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check the information you entered.',
  INTERNAL_ERROR: 'A warehouse system error occurred. Please try again later.',
};

export class AppError extends Error {
  code: ErrorCode;
  details?: Record<string, any>;

  constructor(apiError: ApiError) {
    const code = (apiError.code as ErrorCode) || 'INTERNAL_ERROR';
    super(apiError.message || ERROR_MESSAGES[code]);
    this.code = code;
    this.details = apiError.details;
    this.name = 'AppError';
  }

  get userMessage(): string {
    return ERROR_MESSAGES[this.code] || this.message;
  }
}