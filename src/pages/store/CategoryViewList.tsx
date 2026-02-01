import React from "react";
import ProductListItem from "@/components/store/ProductListItem";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import CategoryPagination from "./CategoryPagination";
import { Product } from "@/domains/catalog/types";
import type { CardProduct } from "@/components/store/ProductCard";

interface CategoryViewListProps {
  loading: boolean;
  paginatedProducts: Product[];
  toCardProduct: (product: Product) => CardProduct;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const CategoryViewList: React.FC<CategoryViewListProps> = ({
  loading,
  paginatedProducts,
  toCardProduct,
  currentPage,
  totalPages,
  setCurrentPage,
}) => (
  <>
    {loading ? (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={`list-skeleton-${index}`} />
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {paginatedProducts.map((product) => (
          <ProductListItem key={product.id} item={toCardProduct(product)} />
        ))}
      </div>
    )}
    <CategoryPagination
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  </>
);

export default CategoryViewList;
