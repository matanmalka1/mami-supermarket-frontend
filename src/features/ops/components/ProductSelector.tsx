import React from "react";
import type { Product } from "@/domains/catalog/types";

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: number;
  onSelectProduct: (productId: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  error?: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  searchValue,
  onSearchChange,
  loading,
  error,
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Select Product
      </label>
      <input
        type="text"
        placeholder="Search products..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-500 transition-all"
      />
      {loading ? (
        <div className="bg-gray-50 rounded-2xl p-4 text-center text-gray-400">
          Loading products...
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 bg-gray-50 rounded-2xl p-4">
          {products.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No products found</p>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelectProduct(product.id)}
                className={`w-full p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  selectedProductId === product.id
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {product.sku} • ₪{product.price}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
