import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/domains/catalog/types";
import type { WishlistItem } from "@/domains/wishlist/types";

interface WishlistProductCardProps {
  product: Product;
  wishlistItem?: WishlistItem;
  updateWishlistItem: (id: number, changes: Partial<WishlistItem>) => void;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({
  product,
  wishlistItem,
  updateWishlistItem,
}) => (
  <div className="relative">
    <ProductCard
      item={{
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.imageUrl,
        oldPrice: product.oldPrice,
        unit: product.unit,
      }}
    />
    <div className="mt-2 p-2 bg-gray-50 rounded shadow-sm">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold">Note:</label>
        <input
          type="text"
          className="border px-2 py-1 rounded text-xs"
          value={wishlistItem?.note || ""}
          onChange={(e) =>
            updateWishlistItem(product.id, { note: e.target.value })
          }
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <label className="text-xs font-semibold">Priority:</label>
        <input
          type="number"
          min={1}
          max={5}
          className="border px-2 py-1 rounded text-xs w-16"
          value={wishlistItem?.priority ?? ""}
          onChange={(e) =>
            updateWishlistItem(product.id, {
              priority: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  </div>
);

export default WishlistProductCard;
