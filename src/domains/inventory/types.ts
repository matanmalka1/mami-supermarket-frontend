// Inventory domain types (frontend only, camelCase, no DTO/backend naming)

export type InventoryProduct = {
  id: number;
  name: string;
  sku: string;
  imageUrl?: string;
};

export type InventoryBranch = {
  id?: number;
  name?: string;
};

export type InventoryRow = {
  id: number;
  available_quantity?: number;
  reserved_quantity?: number;
  availableQuantity?: number;
  reservedQuantity?: number;
  product?: InventoryProduct;
  branch?: InventoryBranch;
};

export const getAvailableQuantity = (row: InventoryRow): number =>
  row.availableQuantity ??
  (row as any).available_quantity ??
  0;

export const getReservedQuantity = (row: InventoryRow): number =>
  row.reservedQuantity ?? (row as any).reserved_quantity ?? 0;
