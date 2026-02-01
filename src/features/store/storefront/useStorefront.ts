import { useState, useEffect, useCallback } from "react";
import { catalogService } from "@/domains/catalog/service";
import type { Category, Product } from "@/domains/catalog/types";

const useStorefront = () => {
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, feats] = await Promise.all([
          catalogService.listCategories(),
          catalogService.listFeaturedProducts(),
        ]);
        setCategories(cats.items ?? []);
        setFeatured(feats);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openFarmModal = useCallback(() => setIsFarmModalOpen(true), []);
  const closeFarmModal = useCallback(() => setIsFarmModalOpen(false), []);

  return {
    categories,
    featured,
    loading,
    isFarmModalOpen,
    openFarmModal,
    closeFarmModal,
  };
};

export default useStorefront;
