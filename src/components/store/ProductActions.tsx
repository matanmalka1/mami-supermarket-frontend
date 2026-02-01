import React from "react";
import Button from "../ui/Button";
import { ShoppingCart, Share2 } from "lucide-react";

interface ProductActionsProps {
  isOutOfStock: boolean;
  onAddToCart: () => void;
  onShare: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  isOutOfStock,
  onAddToCart,
  onShare,
}) => (
  <div className="flex gap-4">
    <Button
      onClick={onAddToCart}
      variant="brand"
      className="flex-1 h-14 rounded-xl text-sm tracking-wide"
      icon={<ShoppingCart size={18} />}
      disabled={isOutOfStock}
    >
      {isOutOfStock ? "Out of stock" : "Add to Cart"}
    </Button>
    <button
      onClick={onShare}
      className="w-14 h-14 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
    >
      <Share2 size={20} />
    </button>
  </div>
);

export default ProductActions;
