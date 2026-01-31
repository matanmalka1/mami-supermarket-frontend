// DTO Types extracted from service.ts

export interface CategoryDTO {
  id: number;
  name: string;
  icon_slug?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export interface ProductDTO {
  id: number;
  name: string;
  sku: string;
  price: number;
  oldPrice?: number | null;
  unit?: string | null;
  nutritionalInfo?: Record<string, unknown> | null;
  isOrganic?: boolean;
  binLocation?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  categoryId: number;
  isActive: boolean;
  inStockAnywhere: boolean;
  inStockForBranch?: boolean | null;
  availableQuantity?: number | null;
}

export interface PaginationDTO {
  total: number;
  limit: number;
  offset: number;
  has_next?: boolean;
}
