import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { Category } from "@/types/domain";

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
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
        const response = await apiService.catalog.getCategories();
        const items = Array.isArray((response as any)?.items)
          ? (response as any).items
          : Array.isArray(response)
            ? response
            : [];
        if (active) setState({ categories: items, loading: false, error: null });
      } catch (err: any) {
        if (active)
          setState({
            categories: [],
            loading: false,
            error: err.message || "Failed to load categories",
          });
      }
    };
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  return state;
};
