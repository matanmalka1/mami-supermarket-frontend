import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/cart-context";
import { Product } from "@/domains/catalog/types";
import ProductInfoHeader from "./ProductInfoHeader";
import ProductPrice from "./ProductPrice";
import ProductStockStatus from "./ProductStockStatus";
import ProductDescription from "./ProductDescription";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductActions from "./ProductActions";
import ProductInfoExtras from "./ProductInfoExtras";

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
        <ProductInfoHeader category={product.category} name={product.name} />
        <ProductPrice price={product.price} oldPrice={product.oldPrice} />
        <ProductStockStatus isOutOfStock={isOutOfStock} />
        <ProductDescription description={product.description} />
        <div className="pt-8 space-y-6 border-t border-gray-100">
          <ProductQuantitySelector
            qty={qty}
            availableQuantity={availableQuantity}
            isOutOfStock={isOutOfStock}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />
          <ProductActions
            isOutOfStock={isOutOfStock}
            onAddToCart={handleAddToCart}
            onShare={handleShare}
          />
          <ProductInfoExtras />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
