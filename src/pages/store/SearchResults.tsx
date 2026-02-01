/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useSearchParams, Link } from "react-router";
import { ArrowLeft, Filter } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ProductGrid from "@/components/store/ProductGrid";
import SearchFiltersDrawer from "@/features/store/search/components/SearchFiltersDrawer";
import { Product } from "@/domains/catalog/types";
import useSearchResults from "@/features/store/search/useSearchResults";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const {
    results,
    loading,
    isFilterOpen,
    openFilters,
    closeFilters,
    activeSort,
    setActiveSort,
    activePrefs,
    togglePref,
    handleApply,
    handleClear,
  } = useSearchResults(query);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12">
        <div className="space-y-4">
          <Link
            to="/store"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#008A45] uppercase tracking-widest group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Store
          </Link>
          <div className="space-y-1">
            <h1 className="text-5xl  text-gray-900 tracking-tight">
              Search Results
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
              {query.trim() ? (
                <>
                  Showing results for:{" "}
                  <span className="text-[#008A45]">"{query}"</span>
                </>
              ) : (
                "Please enter a search term"
              )}
            </p>
          </div>
        </div>
        <button
          onClick={openFilters}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          <Filter size={18} /> Advanced Filters
        </button>
      </div>

      {loading || results.length > 0 ? (
        <ProductGrid
          loading={loading}
          products={results}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
          className="animate-in fade-in duration-700"
        />
      ) : (
        <div className="py-20">
          <EmptyState
            title="No matches found"
            description={`We couldn't find any products matching "${query}". Try searching for categories like "Produce" or "Bakery".`}
          />
        </div>
      )}

      <SearchFiltersDrawer
        isOpen={isFilterOpen}
        activeSort={activeSort}
        activePrefs={activePrefs}
        onClose={closeFilters}
        onApply={handleApply}
        onClear={handleClear}
        onSetSort={(value) => setActiveSort(value)}
        onTogglePref={togglePref}
      />
    </div>
  );
};

export default SearchResults;
