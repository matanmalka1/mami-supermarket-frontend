import { type FC } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { useCatalogAutocomplete } from "@/features/store/hooks/useCatalogAutocomplete";
import type { Product } from "@/domains/catalog/types";

type MissingItemReplacementProps = {
  itemName?: string;
  onSelect: (product: Product) => void;
  onBack?: () => void;
};

const MissingItemReplacement: FC<MissingItemReplacementProps> = ({
  itemName,
  onSelect,
}) => {
  const {
    query,
    setQuery,
    suggestions,
    loading,
    resetSuggestions,
  } = useCatalogAutocomplete({ limit: 8 });

  const handleSelect = (product: Product) => {
    onSelect(product);
    resetSuggestions();
    setQuery("");
  };

  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">
          Searching for an alternative {itemName ? `for ${itemName}` : ""}
        </p>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search catalog..."
            className="w-full border border-gray-100 rounded-2xl bg-white py-4 pl-12 pr-4 text-sm focus:border-[#006666] focus:ring-2 focus:ring-[#006666]/20 transition-all"
            autoFocus
          />
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {loading ? (
          <div className="py-12 text-center text-gray-300 animate-pulse font-black uppercase tracking-widest">
            Searching...
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#006666] hover:bg-emerald-50/30 text-left transition-colors group"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900 truncate">{product.name}</p>
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
                  {product.category}
                </p>
              </div>
              <CheckCircle2
                size={18}
                className="text-gray-200 group-hover:text-[#006666]"
              />
            </button>
          ))
        ) : query.trim() ? (
          <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-[0.3em]">
            No alternatives found
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-[0.3em]">
            Type to search alternatives
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingItemReplacement;
