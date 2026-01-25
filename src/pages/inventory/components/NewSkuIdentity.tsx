import React from "react";

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
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
      Product Name
    </label>
    <input
      required
      placeholder="e.g. Organic Avocados"
      value={productName}
      onChange={(event) => setProductName(event.target.value)}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold"
    />
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-black">
      SKU Preview: {skuPreview}
    </p>
  </div>
);

export default NewSkuIdentity;
