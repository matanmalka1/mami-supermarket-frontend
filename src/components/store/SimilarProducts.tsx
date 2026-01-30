import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

type SimilarProductsProps = {
  items: any[];
  loading: boolean;
  error: string | null;
  offset: number;
  onPrev: () => void;
  onNext: () => void;
};

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  items,
  loading,
  error,
  offset,
  onPrev,
  onNext,
}) => {
  return (
    <div className="py-24 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic">
          You May Also Like
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={onNext}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 font-bold">
          Loading recommendations...
        </p>
      ) : error ? (
        <p className="text-sm text-gray-400 font-bold">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400 font-bold">
          No related products found for this category.
        </p>
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
