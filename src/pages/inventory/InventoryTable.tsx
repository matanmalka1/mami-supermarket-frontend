import React from "react";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { toast } from "react-hot-toast";
import {
  InventoryRow,
  getAvailableQuantity,
  getReservedQuantity,
} from "@/domains/inventory/types";
import InventoryTableRow from "./InventoryTableRow";
import InventoryTableEmptyRow from "./InventoryTableEmptyRow";

type InventoryTableProps = {
  rows: InventoryRow[];
  activeMenuId: number | null;
  onMenuToggle: (id: number | null) => void;
  onUpdateStock: (id: number, qty: number) => void;
  onViewAnalytics: (row: InventoryRow) => void;
  onViewRelocation: (row: InventoryRow) => void;
};

const InventoryTable: React.FC<InventoryTableProps> = ({
  rows,
  activeMenuId,
  onMenuToggle,
  onUpdateStock,
  onViewAnalytics,
  onViewRelocation,
}) => {
  // Removed unused handleAction function

  return (
    <Table>
      <THead>
        <TR isHoverable={false}>
          <TH>Product Details</TH>
          <TH>Branch</TH>
          <TH className="text-center">Stock Level</TH>
          <TH>Reserved</TH>
          <TH className="text-right">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {rows.length === 0 ? (
          <InventoryTableEmptyRow />
        ) : (
          rows.map((inv) => {
            const available = getAvailableQuantity(inv);
            const reserved = getReservedQuantity(inv);
            const branchName = inv.branch?.name || "Central Hub";
            const isLowStock = available <= 25;
            const statusLabel = isLowStock ? "LOW_STOCK" : "OPTIMAL";
            return (
              <InventoryTableRow
                key={inv.id}
                inv={inv}
                available={available}
                reserved={reserved}
                branchName={branchName}
                statusLabel={statusLabel}
                isLowStock={isLowStock}
                activeMenuId={activeMenuId}
                onMenuToggle={onMenuToggle}
                onUpdateStock={onUpdateStock}
                onViewAnalytics={onViewAnalytics}
                onViewRelocation={onViewRelocation}
              />
            );
          })
        )}
      </TBody>
    </Table>
  );
};

export default InventoryTable;
