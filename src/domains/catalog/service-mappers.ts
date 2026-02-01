import type { Category, Product } from "./types";
import type { CategoryDTO, ProductDTO } from "./service-dto";

export const mapCategory = (dto: CategoryDTO): Category => ({
  id: dto.id,
  name: dto.name,
  icon: dto.icon_slug ?? undefined,
  description: dto.description ?? undefined,
});

export const mapProduct = (dto: ProductDTO): Product => ({
  id: dto.id,
  name: dto.name,
  sku: dto.sku,
  category: String(dto.categoryId),
  price: dto.price,
  oldPrice: dto.oldPrice ?? undefined,
  availableQuantity:
    typeof dto.availableQuantity === "number"
      ? Math.max(0, dto.availableQuantity)
      : dto.inStockAnywhere
        ? 1
        : 0,
  reservedQuantity: 0,
  status: dto.isActive ? "active" : "inactive",
  imageUrl: dto.imageUrl ?? "",
  binLocation: dto.binLocation ?? undefined,
  description: dto.description ?? undefined,
  unit: dto.unit ?? undefined,
});
