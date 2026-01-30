import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Truck,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/domain";

interface ProductInfoProps {
  product?: Product | null;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="flex flex-col">
        <p className="text-sm text-gray-500 font-bold">
          Product details are unavailable for this item.
        </p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this ${product.name} I found at Mami Supermarket!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-6 flex-1">
        <div>
          <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md uppercase mb-4 inline-block">
            {product.category}
          </span>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight italic">
            {product.name}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-gray-900 font-mono">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-lg text-gray-300 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {product.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
        </div>
        <p className="text-gray-500 leading-relaxed text-sm font-medium">
          {product.description || "No description provided."}
        </p>
        {/* ...existing code... */}
      </div>
      {/* ...existing code... */}
    </div>
  );
};

export default ProductInfo;
