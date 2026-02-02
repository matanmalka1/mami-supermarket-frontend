import React, { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { useApiError } from "@/hooks/useApiError";
import { useCatalogManager } from "@/features/admin/hooks/useCatalogManager";
import CatalogProductTable from "./CatalogProductTable";
import { CatalogProductForm } from "./CatalogProductForm";
import CatalogCategoryFilters from "./CatalogCategoryFilters";
import CatalogManagerHeader from "./CatalogManagerHeader";
const CatalogManager: React.FC = () => {
  const handleError = useApiError();
  const {
    products,
    totalCount,
    loading,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    editingProduct,
    setEditingProduct,
    refresh,
    deactivateProduct,
    categories,
    createProduct,
    updateProduct,
  } = useCatalogManager();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<any>(null);

  const categoryFilters = useMemo(
    () => [{ id: "all", name: "All" }, ...categories],
    [categories],
  );

  const openForm = (product?: any) => {
    setEditingProduct(product || null);
    setIsFormOpen(true);
  };

  const submitProduct = async (values: {
    name: string;
    sku: string;
    price: string;
    categoryId: string;
    description?: string;
  }) => {
    if (!values.name || !values.sku || !values.price) {
      toast.error("Name, SKU, and price are required");
      return;
    }
    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, {
          name: values.name,
          sku: values.sku,
          price: Number(values.price),
          categoryId: values.categoryId ? Number(values.categoryId) : undefined,
          description: values.description,
        });
        toast.success("Product updated");
      } else {
        await createProduct({
          name: values.name,
          sku: values.sku,
          price: Number(values.price),
          categoryId: values.categoryId
            ? Number(values.categoryId)
            : categories[0]?.id,
          description: values.description,
        });
        toast.success("Product created");
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      refresh();
    } catch (err: any) {
      handleError(err, "Save failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CatalogManagerHeader
        totalCount={totalCount}
        onNewProduct={() => openForm()}
      />

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              placeholder="Filter by Name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:border-[#006666] outline-none"
            />
          </div>
          <CatalogCategoryFilters
            categoryFilters={categoryFilters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
        <CatalogProductTable
          products={products}
          loading={loading}
          onEdit={openForm}
          onDeactivate={(p) => setTargetProduct(p)}
        />
      </div>

      <CatalogProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialProduct={editingProduct}
        onSubmit={submitProduct}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={!!targetProduct}
        onClose={() => setTargetProduct(null)}
        onConfirm={async () => {
          await deactivateProduct(targetProduct.id);
          setTargetProduct(null);
        }}
        variant="danger"
        title="Deactivate SKU"
        message={`Confirm deactivation of ${targetProduct?.name}?`}
        confirmLabel="Deactivate"
      />
    </div>
  );
};

export default CatalogManager;
