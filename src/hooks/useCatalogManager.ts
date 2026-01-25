import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { toast } from "react-hot-toast";

export const useCatalogManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data: any = await apiService.admin.getProducts();
      const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setProducts(rows);
    } catch {
      toast.error("Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deactivateProduct = async (id: string) => {
    try {
      await apiService.admin.toggleProduct(id, false);
      toast.success("Product deactivated");
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredProducts = products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const sku = (p.sku || "").toLowerCase();
    const category = (p.category || p.categoryName || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      category === activeFilter.toLowerCase() ||
      p.category === activeFilter;
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
    refresh: fetchProducts,
  };
};
