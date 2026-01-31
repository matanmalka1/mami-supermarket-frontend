import React from "react";

interface ProductInfoHeaderProps {
  category: string;
  name: string;
}

const ProductInfoHeader: React.FC<ProductInfoHeaderProps> = ({
  category,
  name,
}) => (
  <div>
    <span className="text-[10px] tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md uppercase mb-4 inline-block">
      {category}
    </span>
    <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
      {name}
    </h1>
  </div>
);

export default ProductInfoHeader;
