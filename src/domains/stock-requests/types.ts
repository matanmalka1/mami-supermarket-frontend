// Stock-requests domain types (frontend only, type aliases, camelCase, no backend/DTO naming)

export type StockRequestPriority = "normal" | "urgent" | "critical";

export type StockRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "resolved"
  | "cancelled";

export type StockRequest = {
  id: number | string;
  productName: string;
  sku: string;
  quantity: number;
  priority: StockRequestPriority;
  requester: string;
  status: StockRequestStatus;
  createdAt: string;
};

export type StockRequestCreate = {
  branchId: number;
  productId: number;
  quantity: number;
  requestType: string;
};
