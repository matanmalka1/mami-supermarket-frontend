import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductGallery from "@/screens/ProductDetail/ProductGallery";
import ProductInfo from "@/screens/ProductDetail/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { apiService } from "@/services/api";
import { Product } from "@/types/domain";
import SimilarProducts from "@/components/store/SimilarProducts";
import { addRecentlyViewedItem } from "@/features/store/recently-viewed/utils/recentlyViewed";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        setError("Invalid product ID");
        setProduct(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.catalog.getProduct(numericId);
        setProduct(data);
        addRecentlyViewedItem({
          id: data.id,
          name: data.name,
          category: data.category,
          price: data.price,
          image: data.imageUrl,
          oldPrice: data.oldPrice,
          unit: data.unit,
        });
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
            productId={Number(product.id)} // Ensure product.id is passed as a number
          />
          <ProductInfo product={product} />
        </div>
        <ProductTabs product={product} />
        <SimilarProducts
          category={product.category}
          excludeId={Number(product.id)}
        />{" "}
        // Ensure product.id is passed as a number
      </div>
    </div>
  );
};

export default ProductDetail;
