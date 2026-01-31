import { useState, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useCatalog } from "@/features/store/hooks/useCatalog";
import { useCatalogCategories } from "@/features/store/hooks/useCatalogCategories";
import type { Product } from "@/domains/catalog/types";

type UseCategoryProps = {
  categoryId?: number;
  categoryParam?: string;
};

const useCategory = ({ categoryId, categoryParam }: UseCategoryProps) => {
  const { categories } = useCatalogCategories();
  const matchedCategory =
    typeof categoryId === "number"
      ? categories.find((cat) => cat.id === categoryId)
      : undefined;
  const categoryFilter = matchedCategory?.name;
  const { products, loading } = useCatalog(
    categoryFilter ? Number(categoryFilter) : undefined,
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);

  const categoryLabel = matchedCategory?.name || categoryParam;

  const togglePreference = useCallback((pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((item) => item !== pref)
        : [...prev, pref],
    );
    toast.success(`Filter: ${pref} updated`, {
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  }, []);

  const handlePriceSelection = useCallback((price: string) => {
    setSelectedPrice((prev) => (prev === price ? null : price));
  }, []);

  const filteredProducts = useMemo(() => {
    const priceMatches = (product: Product) => {
      if (!selectedPrice) return true;
      const price = Number(product.price);
      if (Number.isNaN(price)) return true;
      if (selectedPrice === "Under ₪20") return price < 20;
      if (selectedPrice === "₪20 - ₪50") return price >= 20 && price <= 50;
      if (selectedPrice === "Over ₪50") return price > 50;
      return true;
    };

    const preferenceMatches = (product: Product) => {
      if (preferences.length === 0) return true;
      return preferences.every((pref) => {
        const normalized = pref.toLowerCase();
        if (normalized === "organic") {
          return (
            product.category?.toLowerCase().includes("organic") ||
            product.description?.toLowerCase().includes("organic")
          );
        }
        if (normalized === "on sale") {
          return !!(
            product.oldPrice &&
            product.price &&
            Number(product.oldPrice) > Number(product.price)
          );
        }
        if (normalized === "gluten free") {
          return (
            product.description?.toLowerCase().includes("gluten-free") ||
            product.description?.toLowerCase().includes("gluten free")
          );
        }
        return true;
      });
    };

    return products.filter(
      (item) => priceMatches(item) && preferenceMatches(item),
    );
  }, [products, preferences, selectedPrice]);

  return {
    categoryLabel,
    products,
    loading,
    filteredProducts,
    selectedPrice,
    preferences,
    togglePreference,
    handlePriceSelection,
  };
};

export default useCategory;
