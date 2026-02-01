import React from "react";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PickingHeader from "@/components/ops/picking/PickingHeader";
import PickingFooter from "@/components/ops/picking/PickingFooter";
import MissingItemModal from "@/components/ops/modals/MissingItemModal";
import PickingGuidanceCard from "@/pages/ops/components/PickingGuidanceCard";
import PickingItemsTable from "@/pages/ops/components/PickingItemsTable";
import PickingScaleModal from "@/pages/ops/components/PickingScaleModal";
import PickingProgressPanel from "@/pages/ops/components/PickingProgressPanel";
import { Order, OrderItem } from "@/domains/orders/types";

interface Props {
  order: Order;
  items: OrderItem[];
  expandedId: number | null;
  missingItemId: string | number | null;
  onToggleRow: (id: number) => void;
  onUpdateStatus: (
    id: string | number,
    status: string,
    reason?: string,
    replacement?: any,
  ) => void;
  onReportMissing: (id: string | number) => void;
  onReportDamage: (id: string | number, reason: string, notes?: string) => Promise<void>;
  onWeightConfirm: () => void;
  weighingItem: OrderItem | null;
  resetScale: () => void;
  setManualWeight: (weight: number) => void;
  currentWeight: number | null;
  isSimulated: boolean;
  progress: number;
  onSync: () => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
  setMissingItemId: (id: string | number | null) => void;
}

const PickingWorkflowLayout: React.FC<Props> = ({
  order,
  items,
  expandedId,
  missingItemId,
  onToggleRow,
  onUpdateStatus,
  onReportMissing,
  onReportDamage,
  onWeightConfirm,
  weighingItem,
  resetScale,
  setManualWeight,
  currentWeight,
  isSimulated,
  progress,
  onSync,
  onComplete,
  onBack,
  setMissingItemId,
}) => (
  <div className="bg-slate-50 min-h-screen py-16">
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 uppercase tracking-widest group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Deck
        </button>
        <Badge color="blue">Standard Picking Sequence</Badge>
      </div>

      <PickingHeader order={order} itemsCount={items.length} />
      <PickingGuidanceCard />
      <PickingProgressPanel items={items} progress={progress} />

      <PickingItemsTable
        items={items}
        expandedId={expandedId}
        onToggle={onToggleRow}
        onUpdateStatus={onUpdateStatus}
        onReportMissing={onReportMissing}
        onReportDamage={onReportDamage}
      />

      <PickingFooter
        items={items}
        progress={progress}
        onComplete={onComplete}
        onSync={onSync}
      />

      <PickingScaleModal
        isOpen={!!weighingItem}
        weighingItem={weighingItem}
        currentWeight={currentWeight}
        isSimulated={isSimulated}
        onClose={resetScale}
        setManualWeight={setManualWeight}
        onConfirm={onWeightConfirm}
      />

      <MissingItemModal
        itemId={missingItemId}
        itemName={items.find((i) => i.id === missingItemId)?.product?.name}
        onClose={() => setMissingItemId(null)}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  </div>
);

export default PickingWorkflowLayout;
