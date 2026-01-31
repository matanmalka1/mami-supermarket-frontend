import React from "react";

interface ProductPriceProps {
  price: number;
  oldPrice?: number;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ price, oldPrice }) => (
  <div className="flex items-center gap-4">
    <span className="text-4xl font-bold text-gray-900 font-mono">
      ₪ {price}
    </span>
    {oldPrice && (
      <span className="text-lg text-gray-300 line-through">₪ {oldPrice}</span>
    )}
  </div>
);

export default ProductPrice;
