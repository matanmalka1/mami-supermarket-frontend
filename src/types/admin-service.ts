// Types for admin-service
export type AdminSettings = {
  delivery_min: number;
  delivery_fee: number;
  slots: string;
};

// Bridge re-export
export type { StockRequestStatus } from "../domains/stock-requests/types";

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}
export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  category_id: number;
  description?: string;
}
export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  price?: number;
  category_id?: number;
  description?: string;
}
export interface InventoryCreateRequest {
  product_id: number;
  branch_id: number;
  available_quantity: number;
  reserved_quantity?: number;
}
export interface InventoryResponse {
  id: number;
  branch_id: number;
  branch_name: string;
  product_id: number;
  product_name: string;
  available_quantity: number;
  reserved_quantity: number;
  total: number;
  limit: number;
  offset: number;
  productSku: string;
}
export interface CreateBranchRequest {
  name: string;
  address: string;
}
// Bridge re-export for delivery types
export type { CreateDeliverySlotRequest } from "@/domains/delivery/types";
