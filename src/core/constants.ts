
import { OrderStatus, Urgency, Product, Category, Order } from '../types/domain';

export const CATEGORIES: Category[] = [
  { id: "produce", name: "Produce", icon: "🍎" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "bakery", name: "Bakery", icon: "🥖" },
  { id: "meat", name: "Meat", icon: "🥩" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
  { id: "pantry", name: "Pantry", icon: "🧂" }
];

export const STORE_NOTIFICATIONS = [
  { id: 1, text: "Order #9412 is being picked", time: "2m ago", type: 'success' },
  { id: 2, text: "Flash deal starting in 15 mins", time: "10m ago", type: 'info' },
];

export const FEATURED_ITEMS = [
  { id: 1, name: 'Premium Greek Yogurt (500g)', category: 'Dairy', price: 14.90, tag: 'New', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Organic Red Cherries', category: 'Produce', price: 22.00, tag: 'Fresh', unit: '/kg', image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Himalayan Pink Salt Loaf', category: 'Bakery', price: 16.50, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Fresh Basil Pesto', category: 'Deli', price: 19.90, tag: 'Local', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80' }
];

export const MOCK_ORDERS: Partial<Order>[] = [
  {
    id: 'ord_1',
    orderNumber: '9412',
    customer: { fullName: 'David Abramovich', phone: '+972 54-123-4567' },
    status: OrderStatus.PENDING,
    total: 452.00,
    urgency: Urgency.DUE_SOON,
    itemsCount: 12,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_PRODUCTS: Partial<Product>[] = [
  {
    id: '1',
    name: 'Organic Honey Crisp Apples',
    sku: 'APP-HC-ORG',
    category: 'Produce',
    price: 15.90,
    availableQuantity: 120,
    reservedQuantity: 5,
    status: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'
  }
];

export const MOCK_VEHICLES = [
  { id: 'VH-101', driver: 'Marco Rossi', status: 'ON ROUTE', load: '85%', eta: '12:45' },
  { id: 'VH-204', driver: 'Elena Petrova', status: 'LOADING', load: '12%', eta: 'Pending' },
  { id: 'VH-105', driver: 'Chen Wei', status: 'RETURNING', load: '0%', eta: '13:10' },
];

// Fix: Added INITIAL_AUDIT_LOGS export to resolve missing member error in AuditLogs.tsx
export const INITIAL_AUDIT_LOGS = [
  { id: 1, type: 'SECURITY', event: 'Unauthorized Access Attempt', user: 'IP 192.168.1.1', time: '2m ago', severity: 'high' },
  { id: 2, type: 'ADMIN', event: 'Global Settings Updated', user: 'Sarah Jenkins', time: '1h ago', severity: 'mid' },
  { id: 3, type: 'LOGISTICS', event: 'New Fleet Node Deployed', user: 'System Scheduler', time: '3h ago', severity: 'low' },
];

// Fix: Added MOCK_DELIVERY_SLOTS export to resolve missing member error in DeliverySlotManager.tsx
export const MOCK_DELIVERY_SLOTS = [
  { id: '1', time: '08:00 - 10:00', status: 'OPEN', current: 5, capacity: 15 },
  { id: '2', time: '10:00 - 12:00', status: 'FULL', current: 15, capacity: 15 },
  { id: '3', time: '12:00 - 14:00', status: 'LOCKED', current: 0, capacity: 10 },
  { id: '4', time: '14:00 - 16:00', status: 'OPEN', current: 2, capacity: 15 },
  { id: '5', time: '16:00 - 18:00', status: 'OPEN', current: 8, capacity: 15 },
  { id: '6', time: '18:00 - 20:00', status: 'OPEN', current: 4, capacity: 15 },
];
