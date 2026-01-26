export type StockRequest = {
  id: number;
  productName?: string;
  productSku?: string;
  productId?: number;
  branchId?: number;
  branchName?: string;
  quantity?: number;
  requestType?: string;
  status?: string;
  requester?: string;
  time?: string;
  actorUserId?: number;
  createdAt?: string;
};
