import { OrderStatus } from "@/domains/orders/types";

/**
 * Status badge styling configuration
 */
export const STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "bg-emerald-50 text-emerald-700",
  [OrderStatus.IN_PROGRESS]: "bg-amber-50 text-amber-700",
  [OrderStatus.READY]: "bg-sky-50 text-sky-700",
  [OrderStatus.OUT_FOR_DELIVERY]: "bg-blue-50 text-blue-700",
  [OrderStatus.DELIVERED]: "bg-emerald-900 text-white",
  [OrderStatus.CANCELED]: "bg-rose-50 text-rose-700",
  [OrderStatus.DELAYED]: "bg-amber-100 text-amber-800",
  [OrderStatus.MISSING]: "bg-slate-50 text-slate-700",
};
