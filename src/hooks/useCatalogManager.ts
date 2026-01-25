import { useState, useCallback } from "react";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";
import { useAsyncResource } from "./useAsyncResource";

export const useCatalogManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = useCallback(async () => {
    const data: any = await apiService.admin.getProducts();
    return Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  }, []);

  const { data: products, loading, refresh } = useAsyncResource<any[]>(fetchProducts, {
    initialData: [],
    errorMessage: "Failed to load catalog",
  });

  const deactivateProduct = async (id: string) => {
    try {
      await apiService.admin.toggleProduct(id, false);
      toast.success("Product deactivated");
      refresh();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredProducts = products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const sku = (p.sku || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      p.category_id === activeFilter ||
      p.categoryId === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return {
    products: filteredProducts,
    totalCount: products.length,
    loading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    editingProduct,
    setEditingProduct,
    deactivateProduct,
    refresh,
  };
};
