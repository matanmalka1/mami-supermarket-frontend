
export interface UpdateItemStatusRequest {
  picked_status: string;
  reason?: string;
  replacement_product_id?: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface GetOrdersParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
// Ops/Picking domain types

export interface Vehicle {
  id: number;
  driver: string;
  status: "ON_ROUTE" | "LOADING" | "RETURNING" | "STANDBY";
  load: string;
  eta: string;
  pos: { x: number; y: number };
}

export interface StaffPerformance {
  pickerId: number;
  avgPickTime: number;
  accuracyRate: number;
  itemsPicked: number;
  shiftRank: number;
}

export interface OpsPerformanceMetrics {
  batchEfficiency: number;
  livePickers: number;
  activeOrders: number;
  totalOrders: number;
  pickedItems: number;
  totalItems: number;
  pickerWindowMinutes: number;
}
