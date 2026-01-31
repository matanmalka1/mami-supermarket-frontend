import React from "react";
import { Truck, ShieldCheck } from "lucide-react";

const ProductInfoExtras: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 pt-4">
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
        <Truck size={20} />
      </div>
      <div>
        <p className="font-bold text-gray-900 uppercase text-[9px] tracking-widest">
          Shipping
        </p>
        <p className="font-medium">Free Worldwide</p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-xs text-gray-500">
      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
        <ShieldCheck size={20} />
      </div>
      <div>
        <p className="font-bold text-gray-900 uppercase text-[9px] tracking-widest">
          Warranty
        </p>
        <p className="font-medium">Coverage info not provided</p>
      </div>
    </div>
  </div>
);

export default ProductInfoExtras;
