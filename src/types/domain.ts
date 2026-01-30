// Bridge re-exports for order history types
export type {
  OrderTrackingStep,
  OrderHistoryEntry,
} from "@/types/order-history";
// Bridge re-exports for UI state types
export type {} from "@/domains/ui/types";
// Bridge re-exports for pagination types
export type { Pagination } from "@/domains/pagination/types";
// Bridge re-exports for errors types
export type { ErrorCode, ApiError, ApiEnvelope } from "@/domains/errors/types";
// Bridge re-exports for ops types
export type {
  Vehicle,
  StaffPerformance,
  OpsPerformanceMetrics,
} from "@/domains/ops/types";
// Bridge re-exports for notifications types
export type { OpsAlert } from "@/domains/notifications/types";
// Bridge re-exports for auth types
export type { AuthResponse } from "@/domains/auth/types";
// Bridge re-exports for payments types
export type {} from "@/domains/payments/types";

// Bridge re-exports for analytics types
export type {} from "@/domains/analytics/types";
// Bridge re-exports for inventory types
export type {
  InventoryProduct,
  InventoryBranch,
  InventoryRow,
} from "@/domains/inventory/types";
// Bridge re-exports for branch types
export type {
  BranchResponse,
  DeliverySlotResponse,
  DeliverySlotOption,
} from "@/domains/branch/types";
// Bridge re-exports for users/auth types
export type { User, UserRole } from "@/domains/users/types";
// Bridge re-exports for domain types
export type {
  Order,
  OrderItem,
  OrderSuccessSnapshot,
} from "@/domains/orders/types";
export { OrderStatus } from "@/domains/orders/types";
import type { OrderStatus, OrderItem, Order } from "@/domains/orders/types";
import { MoneyILS, ISODateTime } from "./api";

export enum Urgency {
  CRITICAL = "CRITICAL",
  DUE_SOON = "DUE_SOON",
  ON_TRACK = "ON_TRACK",
  SCHEDULED = "SCHEDULED",
}
// Bridge re-exports for catalog types
export type { Product, Category } from "@/domains/catalog/types";

// Bridge re-exports for stock-request types
export type {
  StockRequest,
  StockRequestStatus,
  CreateStockRequest,
} from "@/domains/stock-requests/types";

// Bridge re-export for delivery types
export type { DeliverySlot } from "@/domains/delivery/types";
