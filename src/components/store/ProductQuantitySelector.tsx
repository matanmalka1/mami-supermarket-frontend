import React from "react";
import { Minus, Plus } from "lucide-react";

interface ProductQuantitySelectorProps {
  qty: number;
  availableQuantity: number;
  isOutOfStock: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({
  qty,
  availableQuantity,
  isOutOfStock,
  onDecrease,
  onIncrease,
}) => (
  <div className="space-y-4">
    <label className="text-[10px] uppercase tracking-widest text-gray-400">
      Select Quantity
    </label>
    <div className="flex items-center w-fit border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
      <button
        onClick={onDecrease}
        disabled={qty <= 1 || isOutOfStock}
        className="p-4 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Minus size={16} className="text-gray-400" />
      </button>
      <span className="w-12 text-center text-sm">{qty}</span>
      <button
        onClick={onIncrease}
        disabled={isOutOfStock || qty >= availableQuantity}
        className="p-4 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Plus size={16} className="text-gray-400" />
      </button>
    </div>
  </div>
);

export default ProductQuantitySelector;
