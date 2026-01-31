import React, { useState } from "react";
import { useParams } from "react-router";
import SidebarFilters from "./SidebarFilters";
import useCategory from "@/features/store/category/useCategory";
import { Product } from "@/domains/catalog/types";
import CategoryViewHeader from "./CategoryViewHeader";
import CategoryViewList from "./CategoryViewList";
import CategoryViewGrid from "./CategoryViewGrid";
import CategoryViewEmpty from "./CategoryViewEmpty";
import ProductCard, { CardProduct } from "@/components/store/ProductCard";

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
        <CategoryViewHeader
          categoryLabel={categoryLabel || ""}
          productsCount={products.length}
          loading={loading}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        {viewMode === "list" ? (
          <CategoryViewList
            loading={loading}
            paginatedProducts={paginatedProducts}
            toCardProduct={toCardProduct}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <CategoryViewGrid
            loading={loading}
            paginatedProducts={paginatedProducts}
            toCardProduct={toCardProduct}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
        {!loading && filteredProducts.length === 0 && <CategoryViewEmpty />}
      </main>
    </div>
  );
}

export default CategoryView;
