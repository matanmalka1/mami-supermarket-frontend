import React from "react";
import Badge from "@/components/ui/Badge";
import { Clock, Lock } from "lucide-react";
import type { DeliverySlot } from "@/features/admin/deliverySlots/types";

type Props = {
  slot: DeliverySlot;
  branchName?: string;
  onEdit?: (slot: DeliverySlot) => void;
};

const DeliverySlotCard: React.FC<Props> = ({ slot, branchName, onEdit }) => {
  const startLabel = slot.startTime || slot.start_time || "-";
  const endLabel = slot.endTime || slot.end_time || "-";
  const branchLabel = branchName || slot.branchId || slot.branch_id || "N/A";
  const dayLabel = slot.dayOfWeek ?? slot.day_of_week ?? "N/A";

  const isInactive = slot.is_active === false || slot.status === "LOCKED";

  return (
    <div className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center gap-6">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border-2 ${
            isInactive
              ? "bg-red-50 text-red-500 border-red-100"
              : "bg-gray-50 text-[#006666] border-gray-100"
          }`}
        >
          {isInactive ? <Lock size={24} /> : <Clock size={24} />}
        </div>
        <div>
          <h4 className="text-2xl  text-gray-900">
            {startLabel} &mdash; {endLabel}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <Badge color={slot.is_active === false ? "red" : "emerald"}>
              {slot.is_active === false ? "INACTIVE" : "ACTIVE"}
            </Badge>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Branch: {branchLabel}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="space-y-1 text-right">
          <label className="text-[10px] text-gray-400 uppercase tracking-widest block">
            Day of Week
          </label>
          <div className="font-bold text-gray-700">{dayLabel}</div>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(slot)}
            className="inline-flex px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#008A45] border border-[#008A45]/40 rounded-full hover:bg-[#008A45]/10 transition"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliverySlotCard;
