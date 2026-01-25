export type StockRequest = {
  id: string;
  productName?: string;
  productSku?: string;
  productId?: string;
  branchId?: string;
  branchName?: string;
  quantity?: number;
  requestType?: string;
  status?: string;
  requester?: string;
  time?: string;
  actorUserId?: string;
  createdAt?: string;
};
