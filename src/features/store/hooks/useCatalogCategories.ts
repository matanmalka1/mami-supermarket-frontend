import { useEffect, useState } from "react";
import { catalogService } from "@/domains/catalog/service";
import type { Category } from "@/domains/catalog/types";

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const resolveCategoryPayload = (payload: unknown): Category[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    const candidates = (payload as { items?: unknown }).items;
    if (Array.isArray(candidates)) {
      return candidates;
    }
  }
  return [];
};

export const useCatalogCategories = (): CategoryState => {
  const [state, setState] = useState<CategoryState>({
    categories: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const fetchCategories = async () => {
      try {
        const response = await catalogService.listCategories();
        const items = resolveCategoryPayload(response);
        if (active) {
          setState({ categories: items, loading: false, error: null });
        }
      } catch (err: any) {
        if (active) {
          setState({
            categories: [],
            loading: false,
            error: err.message || "Failed to load categories",
          });
        }
      }
    };
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  return state;
};
