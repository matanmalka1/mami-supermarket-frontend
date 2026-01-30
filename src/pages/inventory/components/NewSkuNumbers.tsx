import React from "react";

type Props = {
  price: number;
  initialStock: number;
  setPrice: (value: number) => void;
  setInitialStock: (value: number) => void;
};

const NewSkuNumbers: React.FC<Props> = ({
  price,
  initialStock,
  setPrice,
  setInitialStock,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-[10px] uppercase text-gray-400 tracking-widest">
        Price (₪)
      </label>
      <input
        type="number"
        min={0}
        step={0.01}
        value={price}
        onChange={(event) =>
          setPrice(Math.max(0, Number.parseFloat(event.target.value) || 0))
        }
        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold"
      />
    </div>
    <div className="space-y-2">
      <label className="text-[10px] uppercase text-gray-400 tracking-widest">
        Initial Stock
      </label>
      <input
        type="number"
        min={0}
        value={initialStock}
        onChange={(event) =>
          setInitialStock(
            Math.max(0, Number.parseInt(event.target.value, 10) || 0),
          )
        }
        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold"
      />
    </div>
  </div>
);

export default NewSkuNumbers;
