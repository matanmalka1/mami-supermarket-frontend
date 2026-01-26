import { MoneyILS, ISODateTime } from './api';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  PICKING = 'PICKING',
  RECEIVED = 'RECEIVED',
  DELAYED = 'DELAYED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Urgency {
  CRITICAL = 'CRITICAL',
  DUE_SOON = 'DUE_SOON',
  ON_TRACK = 'ON_TRACK',
  SCHEDULED = 'SCHEDULED'
}

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

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  pickedStatus: 'PENDING' | 'PICKED' | 'MISSING' | 'REPLACED';
  replacementProductId?: number;
}

export interface DeliverySlot {
  id: number;
  startTime: string;
  endTime: string;
  date?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customer?: {
    fullName: string;
    phone: string;
  };
  customerName?: string;
  itemsSummary?: string;
  status: OrderStatus;
  urgency: Urgency;
  total: MoneyILS;
  itemsCount: number;
  items?: OrderItem[];
  deliverySlot?: DeliverySlot;
  createdAt: ISODateTime;
}
