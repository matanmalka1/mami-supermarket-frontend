import React, { useState } from "react";
import {
  Info,
  ClipboardList,
  AlertCircle,
  Package,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { Product } from "@/domains/catalog/types";

type PickingStatus = "PICKED" | "PENDING" | "MISSING";

type PickingItem = {
  id: string | number;
  pickedStatus?: PickingStatus | string;
  product?: Product | null;
};

interface PickingItemDetailProps {
  item: PickingItem;
  onToggle: () => void;
  onReportDamage: () => Promise<void> | void;
}

const PickingItemDetail: React.FC<PickingItemDetailProps> = ({
  item,
  onToggle,
  onReportDamage,
}) => {
  const [loading, setLoading] = useState(false);

  const handleReportDamage = async () => {
    setLoading(true);
    try {
      await onReportDamage();
      onToggle();
    } finally {
      setLoading(false);
    }
  };

  const product = item.product;
  const productName = product?.name ?? "Product";
  const productDescription =
    product?.description ||
    "Locally sourced organic produce, picked daily for maximum freshness.";

  return (
    <div className="grid grid-cols-12 gap-10 p-10 bg-white rounded-[2.5rem] border border-emerald-100 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[#006666] pointer-events-none">
        <Package size={240} />
      </div>
      <div className="col-span-4 space-y-6">
        <img
          src={product?.imageUrl}
          className="w-full aspect-square rounded-[2rem] object-cover border-8 border-gray-50 shadow-2xl"
          alt={productName}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase mb-1">
              Stock Level
            </span>
            <span className="text-2xl text-gray-800">142</span>
          </div>
          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase mb-1">
              Unit
            </span>
            <span className="text-2xl text-gray-800">PCS</span>
          </div>
        </div>
      </div>
      <div className="col-span-8 flex flex-col">
        <div className="flex-1 space-y-10">
          <div className="space-y-3">
            <h5 className="text-[11px] text-[#006666] uppercase tracking-[0.3em] flex items-center gap-2">
              <Info size={14} /> Profile
            </h5>
            <p className="text-gray-600 text-2xl font-bold  pr-12">
              {productDescription}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <h5 className="text-[11px] text-blue-600 uppercase mb-3">
                Customer Note
              </h5>
              <p className="text-sm font-bold text-blue-900 leading-relaxed ">
                "Please ensure they are firm and have a long expiry date."
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="text-[11px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={14} /> Quality Checklist
              </h5>
              <ul className="space-y-2 text-xs text-gray-600 font-bold">
                {[
                  "Firmness check",
                  "Seal check",
                  "Expiry check",
                  "Label check",
                ].map((g, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-auto flex justify-between border-t border-gray-50">
          <button
            onClick={handleReportDamage}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <AlertCircle size={14} /> {loading ? "Logging..." : "Report Damage"}
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="uppercase tracking-[0.2em] text-[10px]"
          >
            Collapse <ChevronDown size={14} className="rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickingItemDetail;
