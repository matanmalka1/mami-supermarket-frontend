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
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Product {
  id: string;
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
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  pickedStatus: 'PENDING' | 'PICKED' | 'MISSING' | 'REPLACED';
  replacementProductId?: string;
}

export interface DeliverySlot {
  id: string;
  startTime: string;
  endTime: string;
  date?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: {
    fullName: string;
    phone: string;
  };
  status: OrderStatus;
  urgency: Urgency;
  total: MoneyILS;
  itemsCount: number;
  items?: OrderItem[];
  deliverySlot?: DeliverySlot;
  createdAt: ISODateTime;
}