import React from "react";
import WishlistButton from "./WishlistButton";
import { Maximize2 } from "lucide-react";

interface ProductGalleryControlsProps {
  isLiked: boolean;
  productId?: number;
}

const ProductGalleryControls: React.FC<ProductGalleryControlsProps> = ({
  isLiked,
  productId,
}) => (
  <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
    <WishlistButton productId={productId} isLiked={isLiked} />
    <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-emerald-600 shadow-lg transition-all">
      <Maximize2 size={20} />
    </button>
  </div>
);

export default ProductGalleryControls;
