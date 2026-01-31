import React from "react";

interface ProductDescriptionProps {
  description?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => (
  <p className="text-gray-500 leading-relaxed text-sm font-medium">
    {description || "No description provided."}
  </p>
);

export default ProductDescription;
