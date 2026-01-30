import React, { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { useCatalogManager } from "@/features/admin/hooks/useCatalogManager";
import CatalogProductTable from "./CatalogProductTable";
import { CatalogProductForm } from "./CatalogProductForm";
const CatalogManager: React.FC = () => {
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

  const categoryFilters = useMemo(() => [{ id: "all", name: "All" }, ...categories], [categories]);

  const openForm = (product?: any) => {
    setEditingProduct(product || null);
    setIsFormOpen(true);
  };

  const submitProduct = async (values: { name: string; sku: string; price: string; categoryId: string; description?: string }) => {
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
      toast.error(err?.response?.data?.msg || err.message || "Save failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Catalog Management</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            Master Product Index • {totalCount} SKUs
          </p>
        </div>
        <Button variant="emerald" icon={<Plus size={18} />} onClick={() => openForm()}>
          New Product
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Filter by Name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:border-[#006666] outline-none"
            />
          </div>
          <div className="flex gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest overflow-x-auto">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`transition-all whitespace-nowrap ${
                  activeFilter === cat.id ? "text-[#006666]" : "hover:text-[#006666]"
                }`}
              >
                {cat.name || "All"}
              </button>
            ))}
          </div>
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
