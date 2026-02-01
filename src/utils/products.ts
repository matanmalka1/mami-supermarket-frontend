import { Product } from "@/domains/catalog/types";
import { extractArrayPayload } from "@/utils/api-response";

const toNumber = (value: number | string | undefined | null) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const normalizeProduct = (product: Product): Product => ({
  ...product,
  price: toNumber(product.price),
  oldPrice:
    product.oldPrice !== null && product.oldPrice !== undefined
      ? toNumber(product.oldPrice)
      : undefined,
});

export const normalizeProductList = (
  payload: Product[] | { items?: Product[] } | null | undefined,
): Product[] => {
  const items = extractArrayPayload<Product>(payload);
  return items.map((item) => normalizeProduct(item));
};
