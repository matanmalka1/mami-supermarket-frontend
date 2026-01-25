import React from 'react';
import PickingItemRow from '@/components/ops/PickingItemRow';

interface PickingItemsTableProps {
  items: any[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onReportMissing: (id: string) => void;
  onReportDamage: (id: string) => Promise<void> | void;
}

const PickingItemsTable: React.FC<PickingItemsTableProps> = ({
  items,
  expandedId,
  onToggle,
  onUpdateStatus,
  onReportMissing,
  onReportDamage,
}) => (
  <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
    <table className="w-full text-left border-collapse">
      <tbody className="divide-y divide-gray-50">
        {items.map((item) => (
          <PickingItemRow
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            onToggle={() => onToggle(item.id)}
            onUpdateStatus={onUpdateStatus}
            onReportMissing={onReportMissing}
            onReportDamage={onReportDamage}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default PickingItemsTable;
