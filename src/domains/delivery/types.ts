/**
 * @deprecated [2026-01-29] This domain types file has no active consumers and is considered dead code.
 * If you need to revive it, please update documentation and add a consumer.
 */
// Delivery/Logistics domain types

export interface DeliverySlot {
  id: number;
  startTime: string;
  endTime: string;
  date?: string;
}

export interface CreateDeliverySlotRequest {
  branch_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}
