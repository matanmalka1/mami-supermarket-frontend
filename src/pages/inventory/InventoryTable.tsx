import React from "react";
import BaseTable, { type ColumnDefinition } from "@/components/ui/BaseTable";
import { toast } from "react-hot-toast";
import {
  InventoryRow,
  getAvailableQuantity,
  getReservedQuantity,
} from "@/domains/inventory/types";
import InventoryTableRow from "./InventoryTableRow";

type InventoryTableProps = {
  rows: InventoryRow[];
  activeMenuId: number | null;
  onMenuToggle: (id: number | null) => void;
  onUpdateStock: (id: number, qty: number) => void;
  onViewAnalytics: (row: InventoryRow) => void;
  onViewRelocation: (row: InventoryRow) => void;
};

const columns: ColumnDefinition<InventoryRow>[] = [
  { header: "Product Details" },
  { header: "Branch" },
  {
    header: <span className="text-center w-full block">Stock Level</span>,
    className: "text-center",
  },
  { header: "Reserved" },
  {
    header: <span className="text-right w-full block">Actions</span>,
    className: "text-right",
  },
];

const InventoryTable: React.FC<InventoryTableProps> = ({
  rows,
  activeMenuId,
  onMenuToggle,
  onUpdateStock,
  onViewAnalytics,
  onViewRelocation,
}) => {
  return (
    <BaseTable
      data={rows}
      columns={columns}
      emptyLabel="No inventory found."
      rowKey={(inv) => inv.id}
      renderRow={(inv) => {
        const available = getAvailableQuantity(inv);
        const reserved = getReservedQuantity(inv);
        const branchName = inv.branch?.name || "Central Hub";
        const isLowStock = available <= 25;
        const statusLabel = isLowStock ? "LOW_STOCK" : "OPTIMAL";
        const statusVariant = isLowStock ? "orange" : "emerald";
        return (
          <InventoryTableRow
            key={inv.id}
            inv={inv}
            available={available}
            reserved={reserved}
            branchName={branchName}
            statusLabel={statusLabel}
            statusVariant={statusVariant}
            isLowStock={isLowStock}
            activeMenuId={activeMenuId}
            onMenuToggle={onMenuToggle}
            onUpdateStock={onUpdateStock}
            onViewAnalytics={onViewAnalytics}
            onViewRelocation={onViewRelocation}
          />
        );
      }}
    />
  );
};

export default InventoryTable;
