import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useSimilarProducts } from "@/features/store/similar-products/similarProductsFeature";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 8;

type SimilarProductsProps = {
  category?: string;
  excludeId?: number;
};

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  category,
  excludeId,
}) => {
  const { items, loading, error, offset, fetchSimilar } = useSimilarProducts({
    category,
    excludeId,
  });

  const handlePrev = () => {
    if (offset === 0) return;
    fetchSimilar(Math.max(0, offset - PAGE_SIZE));
  };
  const handleNext = () => {
    fetchSimilar(offset + PAGE_SIZE);
  };

  return (
    <div className="py-24 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight ">
          You May Also Like
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 rounded-full border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 shadow-sm"
            onClick={handlePrev}
            disabled={offset === 0 || loading}
          >
            <ArrowLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 rounded-full border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 shadow-sm"
            onClick={handleNext}
            disabled={loading || items.length < PAGE_SIZE}
          >
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading recommendations..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          className="text-sm text-gray-400 font-bold"
        />
      ) : items.length === 0 ? (
        <EmptyState title="No related products found for this category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
