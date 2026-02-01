import { useCallback, useEffect, useState } from "react";
import { catalogService } from "@/domains/catalog/service";
import { useOptionalBranchSelection } from "@/context/branch-context-core";
import type { Product } from "@/domains/catalog/types";
import { normalizeProductList } from "@/utils/products";

type UseCatalogAutocompleteOptions = {
  initialQuery?: string;
  limit?: number;
};

export const useCatalogAutocomplete = ({
  initialQuery = "",
  limit = 6,
}: UseCatalogAutocompleteOptions = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const branchContext = useOptionalBranchSelection();
  const branchId = branchContext?.selectedBranch?.id;

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let active = true;
    const requestLimit = Math.max(limit, 6);
    const timer = window.setTimeout(() => {
      setLoading(true);
      const fetchSuggestions = async () => {
        try {
          const payload = await catalogService.getProducts({
            q: query.trim(),
            branchId,
            limit: requestLimit,
          });
          if (!active) return;
          const normalized = normalizeProductList(payload);
          setSuggestions(limitUniqueProducts(normalized, limit));
        } catch {
          if (!active) return;
          setSuggestions([]);
        } finally {
          if (active) setLoading(false);
        }
      };
      void fetchSuggestions();
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, limit, branchId]);

  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setLoading(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    resetSuggestions,
  };
};

const limitUniqueProducts = (items: Product[], limit: number): Product[] => {
  const seen = new Set<number>();
  const output: Product[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    output.push(item);
    if (output.length >= limit) break;
  }
  return output;
};
