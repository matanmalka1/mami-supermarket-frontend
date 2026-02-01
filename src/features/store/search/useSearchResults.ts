import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { catalogService } from "@/domains/catalog/service";
import { useDeliveryBranch } from "@/features/store/hooks/useDeliveryBranch";
import type { Product } from "@/domains/catalog/types";

const useSearchResults = (query: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Relevance");
  const [activePrefs, setActivePrefs] = useState<string[]>([]);
  const { deliveryBranchId } = useDeliveryBranch();

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { items = [] } = await catalogService.getProducts({
          q: query,
          limit: 24,
          offset: 0,
          branchId: deliveryBranchId,
        });
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
  }, [query, activeSort, activePrefs, deliveryBranchId]);

  const openFilters = useCallback(() => setIsFilterOpen(true), []);
  const closeFilters = useCallback(() => setIsFilterOpen(false), []);
  const handleApply = useCallback(() => {
    setIsFilterOpen(false);
    toast.success("Search parameters applied", { icon: "🔍" });
  }, []);
  const handleClear = useCallback(() => {
    setActivePrefs([]);
    setActiveSort("Relevance");
    toast("Filters cleared", { icon: "🧹" });
  }, []);
  const togglePref = useCallback((pref: string) => {
    setActivePrefs((prev) =>
      prev.includes(pref)
        ? prev.filter((item) => item !== pref)
        : [...prev, pref],
    );
  }, []);

  return {
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
  };
};

export default useSearchResults;
