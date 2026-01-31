import React from "react";
import ProductGrid from "@/components/store/ProductGrid";
import ProductCard, { CardProduct } from "@/components/store/ProductCard";
import CategoryPagination from "./CategoryPagination";
import { Product } from "@/domains/catalog/types";

interface CategoryViewGridProps {
  loading: boolean;
  paginatedProducts: Product[];
  toCardProduct: (product: Product) => CardProduct;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const CategoryViewGrid: React.FC<CategoryViewGridProps> = ({
  loading,
  paginatedProducts,
  toCardProduct,
  currentPage,
  totalPages,
  setCurrentPage,
}) => (
  <>
    <ProductGrid
      loading={loading}
      products={paginatedProducts}
      gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700"
      renderItem={(item: Product) => <ProductCard item={toCardProduct(item)} />}
    />
    <CategoryPagination
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  </>
);

export default CategoryViewGrid;
