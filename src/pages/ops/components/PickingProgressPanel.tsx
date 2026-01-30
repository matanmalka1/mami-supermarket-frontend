import React from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { OrderItem } from "@/domains/orders/types";

interface Props {
  items: OrderItem[];
  progress: number;
}

const PickingProgressPanel: React.FC<Props> = ({ items, progress }) => {
  const pickedCount = items.filter(
    (item) => item.pickedStatus === "PICKED",
  ).length;
  const pendingCount = Math.max(0, items.length - pickedCount);
  const estimateMinutes = Math.max(1, Math.ceil(pendingCount * 1.2));
  const progressValue = Math.min(100, Math.round(progress));

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/70 to-transparent pointer-events-none"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
            Batch Progress
          </p>
          <h3 className="text-5xl text-[#006666] tracking-tighter">
            {pickedCount}
            <span className="text-2xl text-gray-300"> / {items.length}</span>
          </h3>
          <p className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400">
            Items picked
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={16} className="text-emerald-500" />
            {progressValue}% complete
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} className="text-gray-400" />
            Est. {estimateMinutes}m
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 relative z-10">
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#008A45] to-emerald-300 transition-[width]"
            style={{ width: `${progressValue}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-6 text-[10px] uppercase tracking-[0.3em] text-gray-500">
          <div className="flex flex-col gap-1">
            <span className="text-gray-900 text-xs">To Collect</span>
            <span className="text-lg text-orange-500 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-orange-400" />
              {pendingCount} remaining
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-900 text-xs">Estimated time</span>
            <span className="text-lg text-gray-700">{estimateMinutes}m</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-900 text-xs">Status</span>
            <span className="text-lg text-emerald-600">
              {progressValue === 100
                ? "Ready to finalize"
                : "Picking in progress"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickingProgressPanel;
