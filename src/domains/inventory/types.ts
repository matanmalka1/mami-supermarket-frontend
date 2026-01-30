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
  availableQuantity?: number;
  reservedQuantity?: number;
  product?: InventoryProduct;
  branch?: InventoryBranch;
};
