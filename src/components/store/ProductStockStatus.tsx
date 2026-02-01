import React from "react";

interface ProductStockStatusProps {
  isOutOfStock: boolean;
}

const ProductStockStatus: React.FC<ProductStockStatusProps> = ({
  isOutOfStock,
}) => (
  <div
    className={`flex items-center gap-2 text-xs uppercase tracking-widest ${
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
);

export default ProductStockStatus;
