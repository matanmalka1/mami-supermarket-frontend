export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  imageUrl?: string;
  image_url?: string;
}

export interface InventoryBranch {
  id?: string;
  name?: string;
}

export interface InventoryRow {
  id: string;
  availableQuantity?: number;
  reservedQuantity?: number;
  available_quantity?: number;
  reserved_quantity?: number;
  product?: InventoryProduct;
  branch?: InventoryBranch;
}

export const getAvailableQuantity = (row: InventoryRow): number =>
  row.availableQuantity ??
  row.available_quantity ??
  0;

export const getReservedQuantity = (row: InventoryRow): number =>
  row.reservedQuantity ??
  row.reserved_quantity ??
  0;
