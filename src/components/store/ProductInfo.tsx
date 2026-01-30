import { useState } from "react";
import { Minus, Plus, ShoppingCart, Share2, Truck, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/cart-context";
import { Product } from "@/domains/catalog/types";

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

  const availableQuantity = Math.max(0, product.availableQuantity || 0);
  const isOutOfStock = availableQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
  };

  const handleDecrease = () => {
    setQty((current) => Math.max(1, current - 1));
  };

  const handleIncrease = () => {
    if (availableQuantity <= 0) return;
    setQty((current) => Math.min(current + 1, availableQuantity));
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
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight ">
            {product.name}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-gray-900 font-mono">
            ₪ {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-lg text-gray-300 line-through">
              ₪ {product.oldPrice}
            </span>
          )}
        </div>

        <div
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
            isOutOfStock ? "text-red-500" : "text-emerald-600"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isOutOfStock ? "bg-red-500" : "bg-emerald-500"
            }`}
          />
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </div>

        <p className="text-gray-500 leading-relaxed text-sm font-medium">
          {product.description || "No description provided."}
        </p>

        <div className="pt-8 space-y-6 border-t border-gray-100">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Select Quantity
            </label>
            <div className="flex items-center w-fit border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
              <button
                onClick={handleDecrease}
                disabled={qty <= 1 || isOutOfStock}
                className="p-4 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
              >
                <Minus size={16} className="text-gray-400" />
              </button>
              <span className="w-12 text-center font-black text-sm">{qty}</span>
              <button
                onClick={handleIncrease}
                disabled={isOutOfStock || qty >= availableQuantity}
                className="p-4 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
              >
                <Plus size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              variant="emerald"
              className="flex-1 h-14 rounded-xl text-sm font-black tracking-wide"
              icon={<ShoppingCart size={18} />}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of stock" : "Add to Cart"}
            </Button>
            <button
              onClick={handleShare}
              className="w-14 h-14 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-[9px] tracking-widest">
                  Shipping
                </p>
                <p className="font-medium">Free Worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-[9px] tracking-widest">
                  Warranty
                </p>
                <p className="font-medium">Coverage info not provided</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
