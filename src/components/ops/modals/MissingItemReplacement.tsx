import { type FC, type ChangeEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCatalogAutocomplete } from "@/features/store/hooks/useCatalogAutocomplete";
import type { Product } from "@/domains/catalog/types";
import SearchInput from "@/components/ui/SearchInput";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

type MissingItemReplacementProps = {
  itemName?: string;
  onSelect: (product: Product) => void;
  onBack?: () => void;
};

const MissingItemReplacement: FC<MissingItemReplacementProps> = ({
  itemName,
  onSelect,
}) => {
  const { query, setQuery, suggestions, loading, resetSuggestions } =
    useCatalogAutocomplete({ limit: 8 });
  const hasQuery = query.trim().length > 0;
  const hasSuggestions = suggestions.length > 0;

  const handleSelect = (product: Product) => {
    onSelect(product);
    resetSuggestions();
    setQuery("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">
          Searching for an alternative {itemName ? `for ${itemName}` : ""}
        </p>
        <SearchInput
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder="Search catalog..."
          autoFocus
          variant="ops"
        />
      </div>

      <div className="max-h-72 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {loading ? (
          <LoadingState label="Searching..." />
        ) : hasSuggestions ? (
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
                <p className="font-bold text-gray-900 truncate">
                  {product.name}
                </p>
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
        ) : hasQuery ? (
          <EmptyState title="No alternatives found" />
        ) : (
          <EmptyState title="Type to search alternatives" />
        )}
      </div>
    </div>
  );
};

export default MissingItemReplacement;
