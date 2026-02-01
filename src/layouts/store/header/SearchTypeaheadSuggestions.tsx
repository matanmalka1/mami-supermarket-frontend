import { type FC } from "react";
import { ArrowRight } from "lucide-react";
import { currencyILS } from "@/utils/format";
import type { Product } from "@/domains/catalog/types";

type SearchTypeaheadSuggestionsProps = {
  suggestions: Product[];
  highlightedIndex: number;
  loading: boolean;
  listId: string;
  query: string;
  onSelect: (product: Product) => void;
  onViewAll: () => void;
};

const SearchTypeaheadSuggestions: FC<SearchTypeaheadSuggestionsProps> = ({
  suggestions,
  highlightedIndex,
  loading,
  listId,
  query,
  onSelect,
  onViewAll,
}) => {
  if (loading) {
    return (
      <div className="px-4 py-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
        Loading suggestions…
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="px-4 py-3 text-sm font-bold text-gray-500 uppercase tracking-widest">
        No matches yet.
      </div>
    );
  }

  return (
    <>
      <ul id={listId} className="divide-y divide-gray-100">
        {suggestions.map((product, index) => {
          const isActive = index === highlightedIndex;
          return (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => onSelect(product)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-[#008A45]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                aria-selected={isActive}
                id={`search-suggestion-${product.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold truncate">
                    {product.name}
                  </span>
                  <span className="text-xs uppercase tracking-[0.4em] text-gray-400">
                    {currencyILS(product.price)}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-1">
                  {product.category}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
      {query.trim() && suggestions.length > 0 && (
        <div className="border-t border-gray-200">
          <button
            type="button"
            onClick={onViewAll}
            className="w-full px-4 py-3 text-sm font-bold text-[#008A45] hover:bg-emerald-50 transition-colors flex items-center justify-between"
          >
            <span className="uppercase tracking-widest">View All Results</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default SearchTypeaheadSuggestions;
