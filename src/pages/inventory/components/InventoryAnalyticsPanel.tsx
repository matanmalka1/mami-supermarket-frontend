import React from "react";
import { useNavigate } from "react-router";
import Button from "@/components/ui/Button";
import { InventoryRow } from "@/domains/inventory/types";

type Props = {
  data: InventoryRow;
  onClose: () => void;
};

const InventoryAnalyticsPanel: React.FC<Props> = ({ data, onClose }) => {
  const navigate = useNavigate();
  const productName = data.product?.name || "SKU";
  const productId = data.product?.id || "";
  const sku = data.product?.sku || "n/a";
  const branchLabel = data.branch?.name || "Central Hub";
  const available = data.availableQuantity ?? data.available_quantity ?? 0;
  const reserved = data.reservedQuantity ?? data.reserved_quantity ?? 0;

  const handleNavigate = () => {
    onClose();
    navigate(`/admin/analytics${productId ? `?productId=${productId}` : ""}`);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
              Analytics
            </p>
            <h2 className="text-2xl font-black  text-gray-900">
              {productName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-black uppercase tracking-[0.4em] text-gray-400"
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-gray-400">
              SKU
            </p>
            <p className="font-black text-lg">{sku}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-gray-400">
              Branch
            </p>
            <p className="font-black text-lg">{branchLabel}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="uppercase tracking-[0.4em] text-[10px] text-gray-400">
              Available
            </p>
            <p className="text-3xl font-black text-[#008A45]">{available}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="uppercase tracking-[0.4em] text-[10px] text-gray-400">
              Reserved
            </p>
            <p className="text-3xl font-black text-orange-500">{reserved}</p>
          </div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">
          Based on the selected SKU, open the full analytics board to review
          trends and performance.
        </p>
        <Button
          fullWidth
          size="lg"
          className="rounded-2xl h-16"
          onClick={handleNavigate}
        >
          Go to analytics
        </Button>
      </div>
    </div>
  );
};

export default InventoryAnalyticsPanel;
