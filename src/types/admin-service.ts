// Types for admin-service
export type AdminSettings = {
  delivery_min: number;
  delivery_fee: number;
  slots: string;
};

export type StockRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}
export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  category_id: string;
  description?: string;
}
export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  price?: number;
  category_id?: string;
  description?: string;
}
export interface CreateBranchRequest {
  name: string;
  address: string;
}
export interface CreateDeliverySlotRequest {
  branch_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}
