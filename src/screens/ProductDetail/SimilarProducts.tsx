import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { apiService } from "@/services/api";
import ProductCard from "@/screens/Storefront/components/ProductCard";
import { extractArrayPayload } from "@/utils/api-response";

type Props = { category?: string; excludeId?: string };

const SimilarProducts: React.FC<Props> = ({ category, excludeId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchSimilar = async (nextOffset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.catalog.getProducts({
        limit: 8,
        offset: nextOffset,
      });
      const list = extractArrayPayload<any>(response);
      const normalizedCategory = category?.trim().toLowerCase();
      const filtered = list.filter((p: any) => {
        if (excludeId && p.id === excludeId) return false;
        if (!normalizedCategory) return true;
        return p.category?.toLowerCase() === normalizedCategory;
      });
      setItems(filtered);
      setOffset(nextOffset);
    } catch (err: any) {
      setError(err.message || "Failed to load recommendations");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilar(0);
  }, [category, excludeId]);

  return (
    <div className="py-24 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic">
          You May Also Like
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => fetchSimilar(Math.max(offset - 8, 0))}
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => fetchSimilar(offset + 8)}
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
