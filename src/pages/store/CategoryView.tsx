import React, { useState } from "react";
import { useParams, Link } from "react-router";
import {
  SlidersHorizontal,
  ChevronRight,
  LayoutGrid,
  List,
  Check,
  Box,
} from "lucide-react";
import ProductCard, { CardProduct } from "@/components/store/ProductCard";
import ProductGrid from "@/components/store/ProductGrid";
import ProductListItem from "@/components/store/ProductListItem";
import ProductListItemSkeleton from "@/components/store/ProductListItemSkeleton";
import FilterSection from "@/features/store/category/components/FilterSection";
import useCategory from "@/features/store/category/useCategory";
import { Product } from "@/domains/catalog/types";

const toCardProduct = (product: Product): CardProduct => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  tag: product.status,
  image: product.imageUrl,
  oldPrice: product.oldPrice,
  unit: product.unit,
  description: product.description,
  availableQuantity: product.availableQuantity,
});

const CategoryView: React.FC = () => {
  const { id } = useParams();
  const categoryId = id ? Number(id) : undefined;
  const {
    categoryLabel,
    products,
    loading,
    filteredProducts,
    selectedPrice,
    preferences,
    togglePreference,
    handlePriceSelection,
  } = useCategory({ categoryId, categoryParam: id });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
        <Link to="/store" className="hover:text-[#008A45]">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#008A45]">Categories</span>
        <ChevronRight size={12} />
        <span className="text-gray-900 capitalize">{categoryLabel}</span>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Sidebar Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xl font-black  flex items-center gap-3">
              <SlidersHorizontal size={20} className="text-[#008A45]" /> Filter
              Results
            </h3>
            <div className="space-y-4">
              <FilterSection title="Price Range">
                <div className="space-y-3">
                  {["Under ₪20", "₪20 - ₪50", "Over ₪50"].map((p) => (
                    <label
                      key={p}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div onClick={() => handlePriceSelection(p)}
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedPrice === p ? "border-[#008A45] bg-emerald-50 text-[#008A45]" : "border-gray-200 group-hover:border-[#008A45]"}`}
                      >
                        {selectedPrice === p && (
                          <Check size={12} strokeWidth={4} />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold transition-colors ${selectedPrice === p ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}
                      >
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>
              <FilterSection title="Preferences">
                <div className="space-y-3">
                  {["Organic", "On Sale", "Gluten Free"].map((p) => (
                    <label
                      key={p}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        onClick={() => togglePreference(p)}
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${preferences.includes(p) ? "border-[#008A45] bg-emerald-50 text-[#008A45]" : "border-gray-200 group-hover:border-[#008A45]"}`}
                      >
                        {preferences.includes(p) && (
                          <Check size={12} strokeWidth={4} />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold transition-colors ${preferences.includes(p) ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}
                      >
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="col-span-12 lg:col-span-9 space-y-8">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl font-black  text-gray-900 capitalize">
                {categoryLabel}
              </h1>
              {!loading && (
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">
                  {products.length} Items Found
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  viewMode === "grid"
                    ? "bg-white border border-gray-100 text-[#008A45] shadow-sm"
                    : "bg-gray-50 border border-transparent text-gray-400 hover:border-gray-200 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  viewMode === "list"
                    ? "bg-white border border-gray-100 text-[#008A45] shadow-sm"
                    : "bg-gray-50 border border-transparent text-gray-400 hover:border-gray-200 hover:text-gray-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {viewMode === "list" && loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductListItemSkeleton
                  key={`list-skeleton-${index}`}
                />
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  item={toCardProduct(product)}
                />
              ))}
            </div>
          ) : (
            <ProductGrid
              loading={loading}
              products={filteredProducts}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700"
              renderItem={(item: Product) => (
                <ProductCard item={toCardProduct(item)} />
              )}
            />
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto">
                <Box size={32} />
              </div>
              <p className="font-black  text-gray-300 uppercase tracking-widest">
                Aisle Empty in this Department
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryView;
