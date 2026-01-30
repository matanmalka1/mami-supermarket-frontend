// AdminSettings for admin domain (frontend only)
export type AdminSettings = {
  deliveryMin: number;
  deliveryFee: number;
  slots: string;
};

// Product type for admin domain (frontend only)
export type AdminProduct = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  oldPrice?: number;
  availableQuantity: number;
  reservedQuantity: number;
  status: string;
  imageUrl: string;
  binLocation?: string;
  description?: string;
  unit?: string;
  category_id?: number | string;
  image_url?: string;
  categoryId?: number | string;
};

export type AdminStockRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminInventoryCreateRequest = {
  productId: number;
  branchId: number;
  availableQuantity: number;
  reservedQuantity?: number;
};

export type AdminInventoryResponse = {
  id: number;
  branchId: number;
  branchName: string;
  productId: number;
  productName: string;
  availableQuantity: number;
  reservedQuantity: number;
  total: number;
  limit: number;
  offset: number;
  productSku: string;
};

export type AdminCreateProductRequest = {
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  description?: string;
};

export type AdminUpdateProductRequest = {
  name?: string;
  sku?: string;
  price?: number;
  categoryId?: number;
  description?: string;
};
// Admin domain types (frontend only, no DTOs, no backend naming)
// Split if >150 lines. Arrow functions only. No imports from other domains unless approved.

export type AdminStatItem = {
  label: string;
  value: string;
  trend: string;
  sub: string;
};

export type AdminChartEntry = {
  label: string;
  value: number;
  height: number;
};

export type AdminStockRequest = {
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

export type AdminDeliverySlot = {
  id: number;
  startTime?: string;
  endTime?: string;
  branchId?: number;
  dayOfWeek?: number;
  isActive?: boolean;
  status?: string;
};
