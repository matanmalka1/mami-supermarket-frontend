import React from "react";
import TextField from "@/components/ui/form/TextField";

type Props = {
  productName: string;
  setProductName: (value: string) => void;
  skuPreview: string;
};

const NewSkuIdentity: React.FC<Props> = ({
  productName,
  setProductName,
  skuPreview,
}) => (
  <div className="space-y-2">
    <TextField
      label="Product Name"
      required
      placeholder="e.g. Organic Avocados"
      value={productName}
      onChange={(event) => setProductName((event.target as HTMLInputElement).value)}
    />
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em]">
      SKU Preview: {skuPreview}
    </p>
  </div>
);

export default NewSkuIdentity;
