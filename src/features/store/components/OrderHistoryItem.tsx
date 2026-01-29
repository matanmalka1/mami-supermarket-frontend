import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressTimeline from "@/components/ui/ProgressTimeline";
import { Package, Calendar, ChevronDown, ChevronUp, MapPin, CheckCircle2, FileText } from "lucide-react";
import { currencyILS } from "@/utils/format";
import { OrderHistoryEntry } from "@/types/order-history";

type Props = {
  order: OrderHistoryEntry;
  isExpanded: boolean;
  downloadingId: number | null;
  onToggle: () => void;
  onDownloadInvoice: (id: number) => void;
};

const OrderHistoryItem: React.FC<Props> = ({
  order,
  isExpanded,
  downloadingId,
  onToggle,
  onDownloadInvoice,
}) => {
  const tracking = order.tracking ?? [];
  const trackingSteps = tracking.map((step, idx) => ({
    id: step.id ?? `${order.id}-step-${idx}`,
    label: step.status,
    done: Boolean(step.done),
    meta: step.time,
  }));
  const completedCount = trackingSteps.filter((step) => step.done).length;
  const progress = tracking.length ? (completedCount / tracking.length) * 100 : 0;
  const progressPercent = Math.min(100, Math.round(progress));

  return (
    <div className="bg-white border rounded-[2rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
      <div
        className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
            <Package size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-xl italic text-gray-900">
              #{order.orderNumber || order.id?.toString().slice(0, 8)}
            </h3>
            <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Calendar size={12} />{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : order.date}
              </span>
              <span className="flex items-center gap-1">{currencyILS(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Badge
            color={
              order.status === "COMPLETED" || order.status === "DELIVERED"
                ? "emerald"
                : "orange"
            }
          >
            {order.status}
          </Badge>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-300" />
          ) : (
            <ChevronDown size={20} className="text-gray-300" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-8 pb-10 pt-4 border-t space-y-10 animate-in slide-in-from-top-4">
          <ProgressTimeline
            steps={trackingSteps}
            progress={progressPercent}
            renderStepIcon={(step, idx, done) => (done ? <CheckCircle2 size={24} /> : idx + 1)}
            renderStepLabel={(step) => (
              <>
                <p>{step.label}</p>
                {step.meta && (
                  <p className="text-[10px] font-bold text-gray-400">{step.meta}</p>
                )}
              </>
            )}
          />

          <div className="bg-gray-50 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-100">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Ship to
              </h5>
              <div className="flex gap-3">
                <MapPin size={18} className="text-emerald-600" />
                <p className="text-sm font-bold text-gray-700">
                  {order.address || "Saved Delivery Address"}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <Button
                variant="outline"
                className="rounded-xl font-black italic gap-2 h-12"
                loading={downloadingId === order.id}
                onClick={(event) => {
                  event.stopPropagation();
                  onDownloadInvoice(order.id);
                }}
              >
                <FileText size={16} /> Download Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryItem;
