import React from "react";
import PickingItemRow from "@/components/ops/picking/PickingItemRow";
import BaseTable from "@/components/ui/BaseTable";

interface PickingItemsTableProps {
  items: any[];
  expandedId: number | null;
  onToggle: (id: number) => void;
  onUpdateStatus: (id: string | number, status: string) => void;
  onReportMissing: (id: string | number) => void;
  onReportDamage: (id: string | number, reason: string, notes?: string) => Promise<void>;
}

const PickingItemsTable: React.FC<PickingItemsTableProps> = ({
  items,
  expandedId,
  onToggle,
  onUpdateStatus,
  onReportMissing,
  onReportDamage,
}) => (
  <BaseTable
    data={items}
    rowKey={(item) => item.id}
    containerClassName="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden"
    bodyClassName="divide-y divide-gray-50"
    renderRow={(item) => (
      <PickingItemRow
        item={item}
        isExpanded={expandedId === item.id}
        onToggle={() => onToggle(item.id)}
        onUpdateStatus={onUpdateStatus}
        onReportMissing={onReportMissing}
        onReportDamage={onReportDamage}
      />
    )}
  />
);

export default PickingItemsTable;
