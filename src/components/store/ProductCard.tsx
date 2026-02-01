import { useCart } from "@/context/cart-context";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { useWishlist } from "@/context/wishlist-context";
import ProductPricing from "./ProductPricing";

export type CardProduct = {
  id: number;
  name: string;
  category?: string;
  price: number;
  tag?: string;
  image?: string;
  oldPrice?: number;
  unit?: string;
  description?: string;
  availableQuantity?: number;
};

interface ProductCardProps {
  item: CardProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const initials = (text?: string) =>
    (text || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  const isLiked = isWishlisted(item.id);
  const availableQuantity =
    typeof item.availableQuantity === "number"
      ? Math.max(0, item.availableQuantity)
      : undefined;
  const isOutOfStock =
    availableQuantity !== undefined ? availableQuantity <= 0 : false;

  const toggleWishlistHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
    toast(isLiked ? "Removed from wishlist" : "Added to wishlist", {
      icon: isLiked ? "🟣" : "🧡",
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  };

  return (
    <Link
      to={`/store/product/${item.id}`}
      className="group cursor-pointer block"
    >
      <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt={item.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
            {initials(item.name)}
          </div>
        )}
        <button
          onClick={toggleWishlistHandler}
          className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
            isLiked
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <div className="absolute inset-x-4 bottom-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock) {
                addItem(item);
              }
            }}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#008A45] text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-600 active:scale-95"
            }`}
          >
            <ShoppingCart
              size={18}
              className={isOutOfStock ? "text-gray-400" : ""}
            />
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {item.category}
        </p>
        <h4 className="font-bold text-lg leading-tight truncate">
          {item.name}
        </h4>
        <ProductPricing price={item.price} oldPrice={item.oldPrice} />
      </div>
    </Link>
  );
};

export default ProductCard;
