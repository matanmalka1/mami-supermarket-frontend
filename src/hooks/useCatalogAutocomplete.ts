import { useCallback, useEffect, useState } from "react";
import { catalogService } from "@/services/catalog-service";
import { useOptionalBranchSelection } from "@/context/branch-context-core";
import type { Product } from "@/types/domain";

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
          const primaryPayload = await catalogService.getAutocomplete(query.trim(), {
            branchId,
            limit: requestLimit,
          });
          if (!active) return;
          const primary = normalizeProductPayload(primaryPayload);
          if (primary.length > 0) {
            setSuggestions(limitUniqueProducts(primary, limit));
            return;
          }
          const fallbackPayload = await catalogService.getProducts({
            q: query.trim(),
            branchId,
            limit,
          });
          if (!active) return;
          const fallback = normalizeProductPayload(fallbackPayload);
          setSuggestions(limitUniqueProducts(fallback, limit));
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

const normalizeProductPayload = (
  payload: Product[] | { items?: Product[] } | null | undefined,
): Product[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
};

const limitUniqueProducts = (items: Product[], limit: number): Product[] => {
  const seen = new Set<string>();
  const output: Product[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    output.push(item);
    if (output.length >= limit) break;
  }
  return output;
};
