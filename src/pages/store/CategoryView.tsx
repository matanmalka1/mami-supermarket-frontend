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
import SidebarFilters from "./SidebarFilters";
import PaginationControls from "./PaginationControls";
import useCategory from "@/features/store/category/useCategory";
import { Product } from "@/domains/catalog/types";

// Pagination state

function CategoryView() {
  const { categoryParam } = useParams();
  const {
    categoryLabel,
    products,
    loading,
    filteredProducts,
    selectedPrice,
    preferences,
    togglePreference,
    handlePriceSelection,
  } = useCategory({ categoryParam });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const pageSize = 12;
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Convert product to card format if needed
  const toCardProduct = (product: Product): CardProduct => ({
    ...product,
    // Add/transform fields as needed for ProductCard
  });

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Sidebar Filters */}
      <aside className="col-span-12 lg:col-span-3">
        <SidebarFilters
          selectedPrice={selectedPrice}
          preferences={preferences}
          handlePriceSelection={handlePriceSelection}
          togglePreference={togglePreference}
        />
      </aside>
      {/* Product Grid */}
      <main className="col-span-12 lg:col-span-9 space-y-8">
        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl text-gray-900 capitalize">
              {categoryLabel}
            </h1>
            {!loading && (
              <span className="text-xs text-gray-300 uppercase tracking-widest">
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
              <ProductListItemSkeleton key={`list-skeleton-${index}`} />
            ))}
          </div>
        ) : viewMode === "list" ? (
          <>
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  item={toCardProduct(product)}
                />
              ))}
            </div>
            {/* Pagination Controls for List View */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            )}
          </>
        ) : (
          <>
            <ProductGrid
              loading={loading}
              products={paginatedProducts}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700"
              renderItem={(item: Product) => (
                <ProductCard item={toCardProduct(item)} />
              )}
            />
            {/* Pagination Controls for Grid View */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            )}
          </>
        )}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mx-auto">
              <Box size={32} />
            </div>
            <p className="text-gray-300 uppercase tracking-widest">
              Aisle Empty in this Department
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoryView;
