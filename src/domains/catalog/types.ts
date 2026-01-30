import type { MoneyILS } from '@/types/api';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
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
