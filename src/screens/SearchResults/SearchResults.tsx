import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { Search, ArrowLeft, Filter } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";
import ProductGrid from "@/components/store/ProductGrid";
import SearchFiltersDrawer from "@/screens/SearchResults/SearchFiltersDrawer";
import { Product } from "@/types/domain";
import { extractArrayPayload } from "@/utils/api-response";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Relevance");
  const [activePrefs, setActivePrefs] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await apiService.catalog.getProducts({
          q: query,
          limit: 24,
          offset: 0,
        });
        const items = extractArrayPayload<Product>(response);
        if (active) setResults(items);
      } catch (err: unknown) {
        if (active) {
          setResults([]);
          const message = err instanceof Error ? err.message : "Search failed";
          toast.error(message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchResults();
    return () => {
      active = false;
    };
  }, [query, activeSort, activePrefs]);

  const handleApply = () => {
    setIsFilterOpen(false);
    toast.success("Search parameters applied", { icon: "🔍" });
  };

  const handleClear = () => {
    setActivePrefs([]);
    setActiveSort("Relevance");
    toast("Filters cleared", { icon: "🧹" });
  };

  const togglePref = (p: string) => {
    setActivePrefs((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12">
        <div className="space-y-4">
          <Link
            to="/store"
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#008A45] uppercase tracking-widest group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Store
          </Link>
          <div className="space-y-1">
            <h1 className="text-5xl font-black italic text-gray-900 tracking-tight">
              Search Results
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
              Showing results for:{" "}
              <span className="text-[#008A45]">"{query}"</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-800 transition-all active:scale-95"
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
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApply}
        onClear={handleClear}
        onSetSort={(value) => setActiveSort(value)}
        onTogglePref={togglePref}
      />
    </div>
  );
};

export default SearchResults;
