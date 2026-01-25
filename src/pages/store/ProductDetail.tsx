import React, { useEffect, useState } from "react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useParams } from "react-router";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { apiService } from "@/services/api";
import { Product } from "@/types/domain";
import SimilarProducts from "@/components/store/SimilarProducts";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.catalog.getProduct(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
          description={error || "This product could not be loaded from the catalog."}
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

        <SimilarProducts categoryId={product.category} excludeId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
