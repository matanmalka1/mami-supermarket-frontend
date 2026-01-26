export interface Vehicle {
  id: number;
  driver: string;
  status: 'ON_ROUTE' | 'LOADING' | 'RETURNING' | 'STANDBY';
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

export interface StockRequest {
  id: number;
  productName: string;
  sku: string;
  quantity: number;
  priority: 'NORMAL' | 'URGENT' | 'CRITICAL';
  requester: string;
  status: 'PENDING' | 'RESOLVED' | 'CANCELLED';
  createdAt: string;
}

export type OpsAlert = {
  id: number;
  text: string;
  type?: string;
  severity?: string;
  time?: string;
  createdAt?: string;
};
