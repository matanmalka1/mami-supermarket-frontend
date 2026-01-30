import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { adminService } from "@/domains/admin/service";
import { catalogService } from "@/domains/catalog/service";
import { extractArrayPayload } from "@/utils/api-response";
import type { AdminProduct } from "@/domains/admin/types";
import type { AdminCreateProductRequest, AdminUpdateProductRequest } from "@/domains/admin/types";
import type { Category } from "@/domains/catalog/types";

type AdminProductWithLegacyCategory = AdminProduct & {
  category_id?: number | string;
  categoryId?: number | string;
};

export const useCatalogManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | number>("all");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProducts = useCallback(async () => {
    return adminService.getProducts();
  }, []);

  const { data: products, loading, refresh } = useAsyncResource<AdminProduct[]>(
    fetchProducts,
    {
      initialData: [],
      errorMessage: "Failed to load catalog",
    },
  );

  const deactivateProduct = async (id: number) => {
    try {
      await adminService.toggleProduct(id, false);
      toast.success("Product deactivated");
      refresh();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredProducts = products.filter((product) => {
    const subject = product as AdminProductWithLegacyCategory;
    const name = (subject.name || "").toLowerCase();
    const sku = (subject.sku || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      [subject.category_id, subject.categoryId].some(
        (cat) =>
          cat !== undefined &&
          String(cat) === String(activeFilter),
      );
    return matchesSearch && matchesFilter;
  });

  const loadCategories = useCallback(async () => {
    try {
      const response = await catalogService.listCategories();
      const items = extractArrayPayload<Category>(response);
      setCategories(items);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createProduct = useCallback(
    (payload: AdminCreateProductRequest) => adminService.createProduct(payload),
    [],
  );

  const updateProduct = useCallback(
    (id: number, payload: AdminUpdateProductRequest) =>
      adminService.updateProduct(id, payload),
    [],
  );

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
    categories,
    refreshCategories: loadCategories,
    createProduct,
    updateProduct,
  };
};
