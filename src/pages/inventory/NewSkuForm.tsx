import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { adminService } from "@/domains/admin/service";
import { useCatalogCategories } from "@/features/store/hooks/useCatalogCategories";
import { useBranches } from "@/hooks/useBranches";
import { generateSku } from "@/utils/generateSku";
import NewSkuIdentity from "@/pages/inventory/components/NewSkuIdentity";
import NewSkuSelects from "@/pages/inventory/components/NewSkuSelects";
import NewSkuNumbers from "@/pages/inventory/components/NewSkuNumbers";
import NewSkuDescription from "@/pages/inventory/components/NewSkuDescription";
import NewSkuFooter from "@/pages/inventory/components/NewSkuFooter";

type NewSkuFormProps = {
  isOpen: boolean;
  onSuccess: () => void;
};

const NewSkuForm: React.FC<NewSkuFormProps> = ({ isOpen, onSuccess }) => {
  const { categories, loading: categoriesLoading } = useCatalogCategories();
  const { branches, loading: branchesLoading } = useBranches();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [initialStock, setInitialStock] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProductName("");
      setPrice(0);
      setInitialStock(0);
      setDescription("");
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || categories.length === 0) return;
    setSelectedCategory(String(categories[0].id));
  }, [categories, isOpen]);

  useEffect(() => {
    if (!isOpen || branches.length === 0) return;
    setSelectedBranch(String(branches[0].id));
  }, [branches, isOpen]);

  const skuPreview = useMemo(
    () => generateSku(productName || "SKU"),
    [productName],
  );
  const branchLabel =
    branches.find((branch) => String(branch.id) === selectedBranch)?.name ||
    "selected branch";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = productName.trim();
    if (!trimmedName || !selectedCategory || !selectedBranch) {
      setError("Provide the product name, a category, and the branch.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const product = await adminService.createProduct({
        name: trimmedName,
        sku: skuPreview,
        price,
        categoryId: Number(selectedCategory),
        description: description.trim() || undefined,
      });
      await adminService.createInventory({
        productId: product.id,
        branchId: Number(selectedBranch),
        availableQuantity: initialStock,
        reservedQuantity: 0,
      });
      toast.success("SKU registered and stocked");
      onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to register SKU";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const summaryLabel = productName.trim() || "This SKU";
  const isBusy = submitting || categoriesLoading || branchesLoading;

  return (
    <form className="space-y-6 py-4" onSubmit={handleSubmit}>
      <NewSkuIdentity
        productName={productName}
        setProductName={setProductName}
        skuPreview={skuPreview}
      />
      <NewSkuSelects
        categories={categories}
        branches={branches}
        selectedCategory={selectedCategory}
        selectedBranch={selectedBranch}
        onCategoryChange={setSelectedCategory}
        onBranchChange={setSelectedBranch}
        categoriesLoading={categoriesLoading}
        branchesLoading={branchesLoading}
      />
      <NewSkuNumbers
        price={price}
        initialStock={initialStock}
        setPrice={setPrice}
        setInitialStock={setInitialStock}
      />
      <NewSkuDescription
        description={description}
        setDescription={setDescription}
      />
      <NewSkuFooter
        initialStock={initialStock}
        branchLabel={branchLabel}
        summaryLabel={summaryLabel}
        isBusy={isBusy}
        error={error}
        disabled={
          isBusy || !productName.trim() || !selectedCategory || !selectedBranch
        }
      />
    </form>
  );
};

export default NewSkuForm;
