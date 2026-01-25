// Types for ops-service
export interface UpdateItemStatusRequest {
  picked_status: string;
  reason?: string;
  replacement_product_id?: string;
}
export interface UpdateOrderStatusRequest {
  status: string;
}
export interface CreateStockRequest {
  branch_id: string;
  product_id: string;
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
  id: string;
  text: string;
  type?: string;
  severity?: string;
  time?: string;
  createdAt?: string;
}
