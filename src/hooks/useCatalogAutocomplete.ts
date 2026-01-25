import { useCallback, useEffect, useState } from "react";
import { catalogService } from "@/services/catalog-service";
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

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      catalogService
        .getAutocomplete(query.trim())
        .then((results) => {
          if (!active) return;
          setSuggestions(results.slice(0, limit));
        })
        .catch(() => {
          if (!active) return;
          setSuggestions([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, limit]);

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
