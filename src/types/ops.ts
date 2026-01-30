// Bridge re-export for ops types
export type {
  Vehicle,
  StaffPerformance,
  OpsPerformanceMetrics,
} from "@/domains/ops/types";

// Bridge re-export
export type { StockRequest } from "../domains/stock-requests/types";

// Bridge re-export for notifications types
export type { OpsAlert } from "@/domains/notifications/types";
