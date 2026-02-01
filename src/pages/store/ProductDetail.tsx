import React from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useParams } from "react-router";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import SimilarProducts from "@/components/store/SimilarProducts";
import { useProductDetail } from "@/features/store/hooks/useProductDetail";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const parsedId = id ? Number(id) : undefined;
  const isIdInvalid = Boolean(id && Number.isNaN(Number(id)));
  const { product, loading, error } = useProductDetail(
    isIdInvalid ? undefined : parsedId,
  );

  if (isIdInvalid) {
    return (
      <div className="py-20">
        <EmptyState
          title="Product unavailable"
          description="This product could not be loaded from the catalog."
        />
      </div>
    );
  }

  if (loading)
    return (
      <div className="py-40">
        <LoadingState label="Gathering product details..." />
      </div>
    );

  if (!product)
    return (
      <div className="py-20">
        <EmptyState
          title="Product unavailable"
          description={
            error || "This product could not be loaded from the catalog."
          }
        />
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pt-8">
          <ProductGallery
            images={product.imageUrl ? [product.imageUrl] : undefined}
            name={product.name}
            productId={product.id}
          />
          <ProductInfo product={product} />
        </div>

        <ProductTabs product={product} />

        <SimilarProducts category={product.category} excludeId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
