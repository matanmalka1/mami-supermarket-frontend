type MoneyILS = number;

export interface ProductSearchParams {
  q?: string;
  limit?: number;
  offset?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  branchId?: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  iconSlug?: string;
  icon_slug?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: MoneyILS;
  oldPrice?: MoneyILS;
  availableQuantity: number;
  reservedQuantity: number;
  status: string;
  imageUrl: string;
  binLocation?: string;
  description?: string;
  unit?: string;
}
