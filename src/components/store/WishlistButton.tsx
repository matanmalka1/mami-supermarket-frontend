import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useWishlist } from "@/context/wishlist-context";

interface WishlistButtonProps {
  productId?: number;
  isLiked: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  isLiked,
}) => {
  const { toggleWishlist } = useWishlist();

  const handleWishlistToggle = async () => {
    if (productId === undefined) {
      toast("Wishlist is not available for this product", {
        icon: "⚠️",
        style: { borderRadius: "1rem", fontWeight: "bold" },
      });
      return;
    }
    
    try {
      await toggleWishlist(productId);
      toast(isLiked ? "Removed from wishlist" : "Added to wishlist", {
        icon: isLiked ? "🟣" : "🧡",
        style: { borderRadius: "1rem", fontWeight: "bold" },
      });
    } catch {
      // Error already handled by useWishlist
    }
  };

  return (
    <button
      type="button"
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleWishlistToggle}
      className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow transition ${isLiked ? "text-rose-500" : "text-gray-400"}`}
    >
      <Heart fill={isLiked ? "#f43f5e" : "none"} size={22} />
    </button>
  );
};

export default WishlistButton;
