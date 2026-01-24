export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiEnvelope<T> {
  data: T;
  error?: ApiError;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

export type MoneyILS = number;
export type ISODateTime = string;