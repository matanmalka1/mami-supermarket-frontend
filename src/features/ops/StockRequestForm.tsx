import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import { stockRequestsService } from "@/domains/stock-requests/service";
import { stockRequestSchema, StockRequestInput } from "../../validation/ops";
import TextField from "@/components/ui/form/TextField";
import RadioGroupField from "@/components/ui/form/RadioGroupField";
interface Props {
  onSubmitted: () => void;
}
const REQUEST_TYPES: StockRequestInput["requestType"][] = [
  "ADD_QUANTITY",
  "SET_QUANTITY",
];

const StockRequestForm: React.FC<Props> = ({ onSubmitted }) => {
  const {
    register,
    handleSubmit,
    trigger,
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
      await stockRequestsService.create({
        branch: String(data.branchId),
        product: String(data.productId),
        quantity: data.quantity,
        type: data.requestType,
      });
      toast.success("Stock request submitted.", {
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
      className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Branch ID"
          registration={register("branchId")}
          placeholder="ID of branch"
        />
        <TextField
          label="Product ID"
          registration={register("productId")}
          placeholder="ID of product"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Quantity"
          registration={register("quantity")}
          type="number"
          placeholder="0"
          inputClassName="text-lg"
        />
        <RadioGroupField
          label="Request Type"
          name="requestType"
          options={REQUEST_TYPES.map((val) => ({ value: val, label: val }))}
          registration={register("requestType")}
          inline
        />
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-sm font-bold text-emerald-800 flex gap-3">
        <AlertTriangle size={18} className="text-emerald-500 shrink-0" />
        Use exact branch & product IDs. request_type must be ADD_QUANTITY or
        SET_QUANTITY.
      </div>

      <Button
        fullWidth
        size="lg"
        className="rounded-[1.5rem] h-14 text-lg "
        loading={isSubmitting}
        type="button"
        onClick={async () => {
          const isValid = await trigger();
          if (!isValid) {
            const firstError = Object.values(errors)[0]?.message;
            if (firstError) {
              toast.error(firstError as string);
            }
            return;
          }
          await handleSubmit(onSubmit as any)();
        }}
      >
        Submit Stock Request
      </Button>
    </form>
  );
};

export default StockRequestForm;
