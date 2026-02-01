import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DamageReportModal from "@/features/ops/components/DamageReportModal";
import PickingItemDetail from "./PickingItemDetail";
import type { Product } from "@/domains/catalog/types";

type PickingStatus = "PICKED" | "PENDING" | "MISSING";

type PickingItem = {
  id: string | number;
  pickedStatus?: PickingStatus | string;
  quantity: number;
  product?: Product | null;
};

interface PickingItemRowProps {
  item: PickingItem;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (itemId: string | number, status: PickingStatus) => void;
  onReportMissing: (itemId: string | number) => void;
  onReportDamage: (itemId: string | number, reason: string, notes?: string) => Promise<void>;
}

const PickingItemRow: React.FC<PickingItemRowProps> = ({
  item,
  isExpanded,
  onToggle,
  onUpdateStatus,
  onReportMissing,
  onReportDamage,
}) => {
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const isPicked = item.pickedStatus === "PICKED";
  const isMissing = item.pickedStatus === "MISSING";

  return (
    <React.Fragment>
      <tr
        className={`cursor-pointer transition-all duration-300 group ${isExpanded ? "bg-emerald-50/20" : "hover:bg-gray-50/80"}`}
        onClick={onToggle}
      >
        <td className="px-10 py-8 text-center">
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-2xl text-xl border-2 transition-all shadow-sm ${isExpanded ? "bg-[#006666] text-white border-[#006666]" : "bg-blue-50 text-blue-600 border-blue-100"}`}
          >
            {item.product?.binLocation || "A-12"}
          </div>
        </td>
        <td className="px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={item.product?.imageUrl}
                className={`w-20 h-20 rounded-2xl border-4 border-white bg-white object-cover transition-all shadow-md ${isExpanded ? "scale-110" : "group-hover:scale-105"}`}
                alt={item.product?.name}
              />
              <div
                className={`absolute -right-2 -bottom-2 w-8 h-8 bg-white border shadow-md rounded-full flex items-center justify-center transition-all ${isExpanded ? "rotate-180 bg-[#006666] text-white border-[#006666]" : "text-gray-300"}`}
              >
                <ChevronDown size={14} />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl text-gray-900 leading-none tracking-tight">
                {item.product?.name}
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-600">
                  x{item.quantity}
                </span>
                {isMissing && <Badge color="red">Shortage</Badge>}
                {isPicked && <Badge color="emerald">Collected</Badge>}
              </div>
            </div>
          </div>
        </td>
        <td
          className="px-10 py-8 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end gap-3">
            <Button
              size="sm"
              variant={isPicked ? "primary" : "outline"}
              onClick={() => onUpdateStatus(item.id, "PICKED")}
              className="w-32 h-12 rounded-xl"
            >
              {isPicked ? "Picked ✓" : "Confirm"}
            </Button>
            <Button
              size="sm"
              variant={isMissing ? "danger" : "outline"}
              onClick={() => onReportMissing(item.id)}
              className="w-32 h-12 rounded-xl"
            >
              {isMissing ? "Missing !" : "Shortage"}
            </Button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-emerald-50/10">
          <td colSpan={3} className="px-10 pb-10 pt-0">
            <PickingItemDetail
              item={item}
              onToggle={onToggle}
              onReportDamage={() => setIsDamageModalOpen(true)}
            />
          </td>
        </tr>
      )}

      <DamageReportModal
        isOpen={isDamageModalOpen}
        onClose={() => setIsDamageModalOpen(false)}
        onSubmit={(reason, notes) => onReportDamage(item.id, reason, notes)}
        itemName={item.product?.name}
      />
    </React.Fragment>
  );
};

export default PickingItemRow;
