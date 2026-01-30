import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import { apiService } from "../../services/api";
import { stockRequestSchema, StockRequestInput } from "../../validation/ops";
interface Props { onSubmitted: () => void; }
const REQUEST_TYPES: StockRequestInput["requestType"][] = ["ADD_QUANTITY", "SET_QUANTITY"];

const StockRequestForm: React.FC<Props> = ({ onSubmitted }) => {
  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: StockRequestInput) => {
    toast.loading("Submitting stock request...", {
      id: "stock-req",
    });
    try {
      await apiService.ops.createStockRequest({
        branch_id: data.branchId,
        product_id: data.productId,
        request_type: data.requestType,
        quantity: data.quantity,
      });
      toast.success("Stock request submitted.", {
        id: "stock-req",
      });
      reset();
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit stock request", { id: "stock-req" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit as any)}
      className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Branch ID"
          error={errors.branchId?.message}
          input={
            <input
              {...register("branchId")}
              placeholder="ID of branch"
              className={`w-full bg-gray-50 border ${errors.branchId ? "border-red-500" : "border-gray-100"} rounded-2xl py-4 px-4 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold`}
            />
          }
        />
        <Field
          label="Product ID"
          error={errors.productId?.message}
          input={
            <input
              {...register("productId")}
              placeholder="ID of product"
              className={`w-full bg-gray-50 border ${errors.productId ? "border-red-500" : "border-gray-100"} rounded-2xl py-4 px-4 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold`}
            />
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Quantity"
          error={errors.quantity?.message}
          input={
            <input
              type="number"
              {...register("quantity")}
              placeholder="0"
              className={`w-full bg-gray-50 border ${errors.quantity ? "border-red-500" : "border-gray-100"} rounded-2xl py-4 px-4 focus:ring-4 focus:ring-emerald-500/5 outline-none font-black text-lg`}
            />
          }
        />
        <Field
          label="Request Type"
          error={errors.requestType?.message}
          input={
            <div className="grid grid-cols-2 gap-3">
              {REQUEST_TYPES.map((val) => (
                <label
                  key={val}
                  className="p-4 rounded-2xl border bg-gray-50 flex items-center gap-2 text-sm font-bold cursor-pointer transition-colors hover:border-emerald-200"
                >
                  <input
                    type="radio"
                    value={val}
                    {...register("requestType")}
                    className="accent-emerald-600"
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          }
        />
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-sm font-bold text-emerald-800 flex gap-3">
        <AlertTriangle size={18} className="text-emerald-500 shrink-0" />
        Use exact branch & product IDs. request_type must be ADD_QUANTITY or SET_QUANTITY.
      </div>

      <Button
        fullWidth
        size="lg"
        className="rounded-[1.5rem] h-14 text-lg italic"
        loading={isSubmitting}
        type="submit"
      >
        Submit Stock Request
      </Button>
    </form>
  );
};

const Field: React.FC<{ label: string; input: React.ReactNode; error?: string }> = ({
  label,
  input,
  error,
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
    {input}
    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
  </div>
);

export default StockRequestForm;
