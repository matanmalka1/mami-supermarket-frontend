import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { stockRequestsService } from "@/domains/stock-requests/service";
import { stockRequestSchema, StockRequestInput } from "@/validation/ops";
import { useBranches } from "@/hooks/useBranches";
import { useAllProducts } from "./hooks/useAllProducts";
import { FormHeader } from "./components/FormHeader";
import { BranchSelector } from "./components/BranchSelector";
import { ProductSelector } from "./components/ProductSelector";
import { QuantityAndTypeFields } from "./components/QuantityAndTypeFields";
import { RequestSummary } from "./components/RequestSummary";
import { RequestTypeInfo } from "./components/RequestTypeInfo";

interface Props {
  onSubmitted: () => void;
}

const REQUEST_TYPES: StockRequestInput["requestType"][] = [
  "ADD_QUANTITY",
  "SET_QUANTITY",
];

const StockRequestForm: React.FC<Props> = ({ onSubmitted }) => {
  const { branches, loading: branchesLoading } = useBranches();
  const { products, loading: productsLoading } = useAllProducts();
  const [searchProduct, setSearchProduct] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<StockRequestInput>({
    resolver: zodResolver(stockRequestSchema),
    defaultValues: {
      branchId: 0,
      productId: 0,
      quantity: 1,
      requestType: "ADD_QUANTITY",
    },
  });

  const selectedBranchId = watch("branchId");
  const selectedProductId = watch("productId");
  const requestType = watch("requestType");
  const quantity = watch("quantity");

  const filteredProducts = useMemo(() => {
    if (!searchProduct) return products.slice(0, 50);
    return products
      .filter((p) => p.name.toLowerCase().includes(searchProduct.toLowerCase()))
      .slice(0, 50);
  }, [products, searchProduct]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const onSubmit = async (data: StockRequestInput) => {
    toast.loading("Submitting stock request...", { id: "stock-req" });
    try {
      await stockRequestsService.create({
        branchId: data.branchId,
        productId: data.productId,
        quantity: data.quantity,
        requestType: data.requestType,
      });
      toast.success("Stock request submitted successfully!", {
        id: "stock-req",
      });
      reset();
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit stock request", {
        id: "stock-req",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit as any)}
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-[3rem] p-10 shadow-lg space-y-8"
    >
      <FormHeader />

      <BranchSelector
        branches={branches}
        selectedBranchId={selectedBranchId}
        onSelectBranch={(id) => setValue("branchId", id)}
        loading={branchesLoading}
        error={errors.branchId?.message}
      />

      <ProductSelector
        products={filteredProducts}
        selectedProductId={selectedProductId}
        onSelectProduct={(id) => setValue("productId", id)}
        searchValue={searchProduct}
        onSearchChange={setSearchProduct}
        loading={productsLoading}
        error={errors.productId?.message}
      />

      <QuantityAndTypeFields
        register={register}
        errors={errors}
        requestTypes={REQUEST_TYPES}
      />

      <RequestSummary
        selectedBranch={selectedBranch}
        selectedProduct={selectedProduct}
        requestType={requestType}
        quantity={quantity}
      />

      <RequestTypeInfo />

      <Button
        fullWidth
        size="lg"
        className="rounded-[1.5rem] h-16 text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
        loading={isSubmitting}
        type="submit"
        disabled={!selectedBranch || !selectedProduct}
      >
        {isSubmitting ? "Submitting..." : "Submit Stock Request"}
      </Button>
    </form>
  );
};

export default StockRequestForm;
