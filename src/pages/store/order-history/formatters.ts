import type { Order } from "@/domains/orders/types";

/**
 * Parse date string to Date object
 */
export const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Format date for display
 */
export const formatDate = (value?: string): string => {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString("he-IL", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "TBD";
};

/**
 * Format time for display
 */
export const formatTime = (value?: string): string => {
  const date = parseDate(value);
  return date
    ? date.toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";
};

/**
 * Format delivery slot label
 */
export const formatSlotLabel = (slot?: Order["deliverySlot"]): string => {
  if (!slot) return "Delivery window pending";
  const dateLabel = slot.date ? formatDate(slot.date) : "Delivery window";
  return `${dateLabel} • ${formatTime(slot.startTime)} - ${formatTime(
    slot.endTime,
  )}`;
};
