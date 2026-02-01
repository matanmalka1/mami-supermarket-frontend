import React, { type FC } from "react";
import ProductCard from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import LoadingState from "@/components/ui/LoadingState";
import type { Product } from "@/domains/catalog/types";

type ProductGridProps = {
  products: Product[];
  loading: boolean;
  loadingLabel?: string;
  skeletonCount?: number;
  gridClassName?: string;
  className?: string;
  renderItem?: (product: Product) => React.ReactNode;
};

const DEFAULT_GRID_CLASSES =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700";

const ProductGrid: FC<ProductGridProps> = ({
  products,
  loading,
  loadingLabel,
  skeletonCount = 6,
  gridClassName = DEFAULT_GRID_CLASSES,
  className = "",
  renderItem,
}) => {
  const fallbackRender =
    renderItem ?? ((product: Product) => <ProductCard item={product} />);

  if (loading) {
    // If loadingLabel is provided, use LoadingState component
    if (loadingLabel !== undefined) {
      return <LoadingState label={loadingLabel} />;
    }

    // Otherwise, render skeleton grid (default behavior)
    return (
      <div className={`${gridClassName} ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`product-skeleton-${index}`} className="space-y-4">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${gridClassName} ${className}`}>
      {products.map((product) => (
        <React.Fragment key={product.id}>
          {fallbackRender(product)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProductGrid;
