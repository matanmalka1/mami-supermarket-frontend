import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type FC,
} from "react";
import { useNavigate } from "react-router";
import SearchInput from "@/components/ui/SearchInput";
import { useCatalogAutocomplete } from "@/features/store/hooks/useCatalogAutocomplete";
import type { Product } from "@/domains/catalog/types";
import SearchTypeaheadSuggestions from "./SearchTypeaheadSuggestions";

export type SearchTypeaheadProps = {
  onNavigate?: () => void;
};

const SearchTypeahead: FC<SearchTypeaheadProps> = ({ onNavigate }) => {
  const { query, setQuery, suggestions, loading, resetSuggestions } =
    useCatalogAutocomplete({ limit: 6 });
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const listId = "search-suggestions-dropdown";

  const resetAll = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
    setQuery("");
    resetSuggestions();
  }, [resetSuggestions, setQuery]);

  useEffect(() => {
    if (!query.trim()) {
      resetAll();
      return;
    }
    setOpen(true);
  }, [query, resetAll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        resetAll();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [resetAll]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelect(suggestions[highlightedIndex]);
      return;
    }
    navigate(`/store/search?q=${encodeURIComponent(query.trim())}`);
    resetAll();
    onNavigate?.();
  };

  const handleSelect = (product: Product) => {
    navigate(`/store/product/${product.id}`);
    resetAll();
    onNavigate?.();
  };

  const handleViewAll = () => {
    if (!query.trim()) return;
    navigate(`/store/search?q=${encodeURIComponent(query.trim())}`);
    resetAll();
    onNavigate?.();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        suggestions.length === 0 ? -1 : (prev + 1) % suggestions.length,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        suggestions.length === 0
          ? -1
          : (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        event.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (event.key === "Escape") {
      resetAll();
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <form onSubmit={handleSearch}>
        <SearchInput
          variant="store"
          placeholder="Search items..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-activedescendant={
            highlightedIndex >= 0 && suggestions[highlightedIndex]
              ? `search-suggestion-${suggestions[highlightedIndex].id}`
              : undefined
          }
          aria-controls={listId}
        />
      </form>
      {open && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden max-h-72">
          <SearchTypeaheadSuggestions
            suggestions={suggestions}
            highlightedIndex={highlightedIndex}
            loading={loading}
            listId={listId}
            query={query}
            onSelect={handleSelect}
            onViewAll={handleViewAll}
          />
        </div>
      )}
    </div>
  );
};

export default SearchTypeahead;
