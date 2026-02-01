import React from "react";
import TextField from "@/components/ui/form/TextField";
import RadioGroupField from "@/components/ui/form/RadioGroupField";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { StockRequestInput } from "@/validation/ops";

interface QuantityAndTypeProps {
  register: UseFormRegister<StockRequestInput>;
  errors: FieldErrors<StockRequestInput>;
  requestTypes: StockRequestInput["requestType"][];
}

export const QuantityAndTypeFields: React.FC<QuantityAndTypeProps> = ({
  register,
  errors,
  requestTypes,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <TextField
          label="Quantity"
          registration={register("quantity")}
          type="number"
          placeholder="Enter quantity"
          inputClassName="text-2xl font-bold h-16 rounded-2xl"
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <RadioGroupField
          label="Request Type"
          name="requestType"
          options={requestTypes.map((val) => ({
            value: val,
            label: val.replace("_", " "),
          }))}
          registration={register("requestType")}
          inline={false}
        />
      </div>
    </div>
  );
};
