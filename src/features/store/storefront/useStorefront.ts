import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/api";
import { extractArrayPayload } from "@/utils/api-response";

const useStorefront = () => {
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, feats] = await Promise.all([
          apiService.catalog.getCategories(),
          apiService.catalog.getFeatured(),
        ]);
        setCategories(extractArrayPayload<any>(cats));
        setFeatured(extractArrayPayload<any>(feats));
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
