export type {
  InventoryProduct,
  InventoryBranch,
  InventoryRow,
} from "@/domains/inventory/types";

import type { InventoryRow } from "@/domains/inventory/types";

export const getAvailableQuantity = (row: InventoryRow): number =>
  row.availableQuantity ?? row.available_quantity ?? 0;

export const getReservedQuantity = (row: InventoryRow): number =>
  row.reservedQuantity ?? row.reserved_quantity ?? 0;
