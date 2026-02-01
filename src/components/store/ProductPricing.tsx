import React from "react";
import { currencyILS } from "@/utils/format";

type ProductPricingProps = {
  price: number;
  oldPrice?: number;
  containerClassName?: string;
  priceClassName?: string;
  oldPriceClassName?: string;
};

const ProductPricing: React.FC<ProductPricingProps> = ({
  price,
  oldPrice,
  containerClassName = "flex items-baseline gap-3",
  priceClassName = "text-xl text-[#008A45]",
  oldPriceClassName = "text-sm text-gray-400 line-through",
}) => (
  <div className={containerClassName}>
    <div className={priceClassName}>{currencyILS(price)}</div>
    {oldPrice && oldPrice > 0 && (
      <span className={oldPriceClassName}>{currencyILS(oldPrice)}</span>
    )}
  </div>
);

export default ProductPricing;
