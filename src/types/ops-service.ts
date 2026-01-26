// Types for ops-service
export interface UpdateItemStatusRequest {
  picked_status: string;
  reason?: string;
  replacement_product_id?: number;
}
export interface UpdateOrderStatusRequest {
  status: string;
}
export interface CreateStockRequest {
  branch_id: number;
  product_id: number;
  quantity: number;
  request_type: string;
}
export interface GetOrdersParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}
export interface OpsAlert {
  id: number;
  text: string;
  type?: string;
  severity?: string;
  time?: string;
  createdAt?: string;
}
