import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import type { CardProduct } from "./ProductCard";
import ProductPricing from "./ProductPricing";

type ProductListItemProps = {
  item: CardProduct;
};

const getInitials = (text?: string) =>
  (text || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("") || "?";

const ProductListItem: React.FC<ProductListItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const isLiked = isWishlisted(item.id);
  const availableQuantity = typeof item.availableQuantity === "number"
      ? Math.max(0, item.availableQuantity)
      : undefined;
  const isOutOfStock = availableQuantity !== undefined ? availableQuantity <= 0 : false;

  const handleWishlistToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(item.id);
    toast(isLiked ? "Removed from wishlist" : "Added to wishlist", {
      icon: isLiked ? "🟣" : "🧡",
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    addItem(item);
  };

  return (
    <Link
      to={`/store/product/${item.id}`}
      className="group block rounded-[2.5rem] border border-gray-100 bg-white shadow-sm transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500/50"
    >
      <div className="flex flex-col items-stretch gap-5 p-6 md:flex-row md:items-center md:gap-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-100 md:h-32 md:w-32">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-gray-300">
              {getInitials(item.name)}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          {item.category && (
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
              {item.category}
            </p>
          )}
          <h3 className="text-2xl text-gray-900 leading-tight">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-500">{item.description}</p>
          )}
          <ProductPricing
            price={item.price}
            oldPrice={item.oldPrice}
            containerClassName="flex items-baseline gap-4"
            priceClassName="text-2xl font-black text-[#008A45]"
          />
          {availableQuantity !== undefined && (
            <p
              className={`text-[10px] uppercase tracking-[0.4em] ${
                isOutOfStock ? "text-red-500" : "text-gray-400"
              }`}
            >
              {isOutOfStock ? "Out of stock" : `${availableQuantity} in stock`}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-3 md:items-end">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-2 rounded-2xl border border-transparent px-5 py-3 text-sm uppercase tracking-[0.3em] transition active:scale-95 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#008A45] text-white hover:bg-emerald-600 shadow-xl shadow-emerald-900/20"
            }`}
          >
            <ShoppingCart
              size={16}
              className={isOutOfStock ? "text-gray-400" : ""}
            />
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            className={`h-11 w-11 rounded-2xl border border-gray-200 transition ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white text-gray-500 hover:border-gray-300 hover:text-gray-600"
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductListItem;
